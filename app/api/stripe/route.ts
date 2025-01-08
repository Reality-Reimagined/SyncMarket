import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, images, metadata, prices } = await req.json();

    // Create Stripe product
    const product = await stripe.products.create({
      name,
      description,
      images,
      metadata: {
        isSaas: metadata.isSaas.toString(),
        download_url: metadata.download_url,
        commission_rate_one_time: metadata.commission_rate_one_time,
        commission_rate_recurring: metadata.commission_rate_recurring || "",
        category: metadata.category,
        demo_url: metadata.demo_url || "",
        refund_policy: metadata.refund_policy,
        support_email: metadata.support_email,
        requirements: JSON.stringify(metadata.requirements),
        features: JSON.stringify(metadata.features),
      },
    });

    // Create Stripe prices
    const createdPrices = await Promise.all(
      prices.map((price: any) =>
        stripe.prices.create({
          product: product.id,
          currency: price.currency,
          unit_amount: price.unit_amount,
          recurring: price.recurring || undefined,
        })
      )
    );

    // Store in Supabase using the existing schema
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        creator_id: user.id,
        title: name,
        description,
        image_url: images[0],
        stripe_product_id: product.id,
        is_subscription: metadata.isSaas === 'true',
        download_url: metadata.download_url,
        commission_rate: parseFloat(metadata.commission_rate_one_time),
        recurring_commission_rate: metadata.commission_rate_recurring 
          ? parseFloat(metadata.commission_rate_recurring)
          : null,
        stripe_price_id: createdPrices[0].id, // Primary price
        price: createdPrices[0].unit_amount / 100, // Convert from cents to dollars
        // If there's a second price (for hybrid pricing), store it in metadata
        additional_prices: createdPrices.length > 1 ? {
          additional_price_ids: createdPrices.slice(1).map(p => p.id)
        } : null,
        status: 'active'
      })
      .select()
      .single();

    if (productError) {
      throw productError;
    }

    // Get affiliate ref from cookie
    const cookieStore = cookies();
    const affiliateRef = cookieStore.get('affiliate_ref')?.value;

    // If there's an affiliate ref, get the affiliate details
    let affiliateData;
    if (affiliateRef) {
      const { data: affiliateLink } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('custom_ref_id', affiliateRef)
        .single();

      if (affiliateLink) {
        affiliateData = affiliateLink;
      }
    }

    // Create Stripe checkout session with affiliate metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: createdPrices[0].id,
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${productData.id}`,
      metadata: {
        product_id: productData.id,
        affiliate_id: affiliateData?.affiliate_id || '',
        affiliate_link_id: affiliateData?.id || '',
        custom_ref_id: affiliateRef || '',
        commission_rate: metadata.commission_rate_one_time,
        recurring_commission_rate: metadata.commission_rate_recurring || ''
      }
    });

    return NextResponse.json({ product, prices: createdPrices, dbProduct: productData, sessionId: session.id });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 