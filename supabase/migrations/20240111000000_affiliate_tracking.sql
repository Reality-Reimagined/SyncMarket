-- Create table for affiliate links
CREATE TABLE affiliate_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  custom_ref_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP WITH TIME ZONE
);

-- Create table for affiliate sales
CREATE TABLE affiliate_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  customer_id TEXT NOT NULL, -- Stripe customer ID
  sale_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  affiliate_link_id UUID REFERENCES affiliate_links(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_sales ENABLE ROW LEVEL SECURITY;

-- Policies for affiliate_links
CREATE POLICY "Users can view their own affiliate links" 
  ON affiliate_links FOR SELECT 
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Users can create their own affiliate links" 
  ON affiliate_links FOR INSERT 
  WITH CHECK (auth.uid() = affiliate_id);

-- Policies for affiliate_sales
CREATE POLICY "Users can view their own affiliate sales" 
  ON affiliate_sales FOR SELECT 
  USING (auth.uid() = affiliate_id);

-- Create indexes
CREATE INDEX idx_affiliate_links_ref ON affiliate_links(custom_ref_id);
CREATE INDEX idx_affiliate_sales_session ON affiliate_sales(stripe_session_id); 