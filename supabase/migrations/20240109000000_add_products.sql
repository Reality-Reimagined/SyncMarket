create type product_status as enum ('active', 'draft', 'archived');

create table products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  image_url text,
  stripe_product_id text unique not null,
  is_saas boolean default false,
  download_url text,
  commission_rate_one_time decimal(5,2) not null,
  commission_rate_recurring decimal(5,2),
  prices jsonb not null default '[]'::jsonb,
  status product_status default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table products enable row level security;

create policy "Users can view all active products" 
  on products for select 
  using (status = 'active');

create policy "Users can create their own products" 
  on products for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own products" 
  on products for update 
  using (auth.uid() = user_id);

-- Add updated_at trigger
create trigger set_updated_at
  before update on products
  for each row
  execute function common.set_updated_at();

-- Create index for faster queries
create index products_user_id_idx on products(user_id);
create index products_status_idx on products(status); 