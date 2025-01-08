-- Function to increment a counter
CREATE OR REPLACE FUNCTION increment(row_id text, increment_amount int)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  current_value int;
BEGIN
  SELECT clicks INTO current_value
  FROM affiliate_links
  WHERE custom_ref_id = row_id;
  
  RETURN COALESCE(current_value, 0) + increment_amount;
END;
$$;

-- Function to update product metrics
CREATE OR REPLACE FUNCTION update_product_metrics(product_id uuid, sale_amount decimal)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products
  SET 
    total_sales = COALESCE(total_sales, 0) + 1,
    total_revenue = COALESCE(total_revenue, 0) + sale_amount
  WHERE id = product_id;
END;
$$; 