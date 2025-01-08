import Stripe from 'stripe';
import { stripe } from './stripe';

export async function createStripeConnectAccount(userId: string, email: string) {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: email,
      capabilities: {
        transfers: { requested: true },
      },
      metadata: {
        userId,
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/affiliates/dashboard`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/affiliates/dashboard`,
      type: 'account_onboarding',
    });

    return { accountLink, accountId: account.id };
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error);
    throw error;
  }
}

export async function createPaymentIntent(amount: number, applicationFeeAmount: number, stripeConnectAccountId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: stripeConnectAccountId,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function createPayout(stripeConnectAccountId: string, amount: number) {
  try {
    const payout = await stripe.payouts.create(
      {
        amount,
        currency: 'usd',
      },
      {
        stripeAccount: stripeConnectAccountId,
      }
    );

    return payout;
  } catch (error) {
    console.error('Error creating payout:', error);
    throw error;
  }
}