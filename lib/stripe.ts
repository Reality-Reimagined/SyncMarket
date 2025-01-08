import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// This will only run on the server
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export type Recurring = {
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  trial_period_days?: number | null;
  usage_type?: 'metered' | 'licensed';
};