import { stripe, type Recurring } from "./stripe";

export async function createStripeProduct({
  name,
  description,
  images,
  metadata,
}: {
  name: string;
  description: string;
  images: string[];
  metadata: Record<string, string>;
}) {
  return await stripe.products.create({
    name,
    description,
    images,
    metadata,
  });
}

export async function createStripePrice({
  product,
  unit_amount,
  currency,
  recurring,
}: {
  product: string;
  unit_amount: number;
  currency: string;
  recurring: Recurring | null;
}) {
  return await stripe.prices.create({
    product,
    unit_amount,
    currency,
    recurring: recurring ? { ...recurring, trial_period_days: recurring.trial_period_days ?? undefined } : undefined,
  });
} 