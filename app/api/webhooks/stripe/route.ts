import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    ) as Stripe.Event;

    const supabase = createServerComponentClient({ cookies });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Only process if this was an affiliate sale
        if (session.metadata?.affiliate_id) {
          const commission_amount = calculateCommissionAmount(
            session.amount_total!,
            parseFloat(session.metadata.commission_rate)
          );

          // Record the affiliate sale
          const { error: saleError } = await supabase
            .from('affiliate_sales')
            .insert({
              affiliate_id: session.metadata.affiliate_id,
              product_id: session.metadata.product_id,
              customer_id: session.customer,
              sale_amount: session.amount_total! / 100,
              commission_amount,
              stripe_session_id: session.id,
              affiliate_link_id: session.metadata.affiliate_link_id,
              status: 'pending'
            });

          if (saleError) {
            console.error('Error recording affiliate sale:', saleError);
            return NextResponse.json(
              { error: 'Failed to record affiliate sale' },
              { status: 500 }
            );
          }
        }

        // Update product sales metrics using rpc
        const { error: productError } = await supabase.rpc('update_product_metrics', {
          product_id: session.metadata?.product_id,
          sale_amount: session.amount_total! / 100
        });

        if (productError) {
          console.error('Error updating product metrics:', productError);
        }
        break;
      }

      case 'invoice.paid': {
        // Handle recurring payments for subscription products
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.metadata?.affiliate_id) {
          const commission_amount = calculateCommissionAmount(
            invoice.amount_paid,
            parseFloat(invoice.metadata.recurring_commission_rate)
          );

          const { error: recurringError } = await supabase
            .from('affiliate_sales')
            .insert({
              affiliate_id: invoice.metadata.affiliate_id,
              product_id: invoice.metadata.product_id,
              customer_id: invoice.customer,
              sale_amount: invoice.amount_paid / 100,
              commission_amount,
              stripe_session_id: invoice.id,
              affiliate_link_id: invoice.metadata.affiliate_link_id,
              status: 'pending',
              is_recurring: true
            });

          if (recurringError) {
            console.error('Error recording recurring commission:', recurringError);
          }
        }
        break;
      }

      case 'charge.refunded': {
        // Handle refunds and update affiliate commission status
        const charge = event.data.object as Stripe.Charge;
        
        const { error: refundError } = await supabase
          .from('affiliate_sales')
          .update({ status: 'cancelled' })
          .eq('stripe_session_id', charge.payment_intent);

        if (refundError) {
          console.error('Error updating refunded sale:', refundError);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

function calculateCommissionAmount(saleAmount: number, commissionRate: number): number {
  return (saleAmount * commissionRate) / 10000; // Divide by 10000 because amount is in cents and rate is a percentage
}