/*
  # Initial Schema Setup for Digital Marketplace

  1. Tables
    - profiles
      - Extended user profile information
      - Linked to auth.users
    - products
      - Digital products/services listings
      - Includes pricing and commission details
    - affiliates
      - Affiliate program participants
      - Tracks commission rates and payment info
    - sales
      - Records of all transactions
      - Links products, buyers, and affiliates
    - payouts
      - Tracks commission payments to affiliates
    - stripe_connects
      - Stores Stripe Connect account information

  2. Security
    - RLS policies for all tables
    - Secure access patterns for different user roles
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('vendor', 'affiliate', 'admin');
CREATE TYPE payout_schedule AS ENUM ('weekly', 'biweekly', 'monthly');
CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');

-- Profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  role user_role DEFAULT 'affiliate',
  company_name text,
  bio text,
  website_url text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Products table
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  commission_rate decimal(5,2) NOT NULL,
  status product_status DEFAULT 'draft',
  image_url text,
  download_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Affiliates table
CREATE TABLE affiliates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  payout_schedule payout_schedule DEFAULT 'monthly',
  stripe_connect_id text,
  total_earnings decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sales table
CREATE TABLE sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id),
  buyer_id uuid REFERENCES profiles(id),
  affiliate_id uuid REFERENCES affiliates(id),
  amount decimal(10,2) NOT NULL,
  commission_amount decimal(10,2) NOT NULL,
  stripe_payment_id text,
  created_at timestamptz DEFAULT now()
);

-- Payouts table
CREATE TABLE payouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id uuid REFERENCES affiliates(id),
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  stripe_payout_id text,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Published products are viewable by everyone"
  ON products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Vendors can manage their products"
  ON products FOR ALL
  USING (auth.uid() = vendor_id);

-- Affiliates policies
CREATE POLICY "Affiliates can view their own data"
  ON affiliates FOR SELECT
  USING (auth.uid() = profile_id);

-- Sales policies
CREATE POLICY "Users can view their own sales"
  ON sales FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE
        id = buyer_id OR
        id = (SELECT profile_id FROM affiliates WHERE id = affiliate_id) OR
        id = (SELECT vendor_id FROM products WHERE id = product_id)
    )
  );

-- Payouts policies
CREATE POLICY "Affiliates can view their own payouts"
  ON payouts FOR SELECT
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE profile_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();