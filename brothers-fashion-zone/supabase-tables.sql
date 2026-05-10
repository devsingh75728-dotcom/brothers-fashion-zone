-- Run this SQL in your Supabase SQL Editor

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  image_url text not null,
  button_text text,
  button_link text,
  bg_color text default '#6B5CE7',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON banners FOR ALL USING (true) WITH CHECK (true);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  banner_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON brands FOR ALL USING (true) WITH CHECK (true);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON categories FOR ALL USING (true) WITH CHECK (true);

-- Create reels table
CREATE TABLE IF NOT EXISTS reels (
  id uuid primary key default gen_random_uuid(),
  title text,
  instagram_url text not null,
  thumbnail_url text,
  show_on_homepage boolean default true,
  created_at timestamptz default now()
);
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON reels FOR ALL USING (true) WITH CHECK (true);

-- Create store_videos table
CREATE TABLE IF NOT EXISTS store_videos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  type text not null,
  section text,
  thumbnail text,
  created_at timestamptz default now()
);
ALTER TABLE store_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON store_videos FOR ALL USING (true) WITH CHECK (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  subtotal decimal(10,2) not null,
  shipping decimal(10,2) default 0,
  total decimal(10,2) not null,
  payment_method text default 'upi',
  utr_number text,
  payment_status text default 'pending',
  order_status text default 'pending',
  tracking_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON contact_messages FOR ALL USING (true) WITH CHECK (true);

-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON store_settings FOR ALL USING (true) WITH CHECK (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null,
  subcategory text,
  price decimal(10,2) not null,
  original_price decimal(10,2),
  discount_pct integer default 0,
  description text,
  images jsonb default '[]',
  variants jsonb default '[]',
  colors jsonb default '[]',
  tags jsonb default '[]',
  total_stock integer default 0,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON products FOR ALL USING (true) WITH CHECK (true);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text default 'percent',
  discount_value decimal(10,2) not null,
  min_order_amount decimal(10,2) default 0,
  max_discount decimal(10,2),
  usage_limit integer,
  used_count integer default 0,
  is_active boolean default true,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz default now()
);
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON coupons FOR ALL USING (true) WITH CHECK (true);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  product_id text not null,
  created_at timestamptz default now()
);
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON wishlists FOR ALL USING (true) WITH CHECK (true);

-- Create profiles table (for auth)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  created_at timestamptz default now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO store_settings (key, value) VALUES 
  ('logo_url', null),
  ('store_name', 'Brother''s Fashion Zone'),
  ('contact_email', 'support@brothersfashion.com'),
  ('contact_phone', '+91 98765 43210')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- Create product-images bucket (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product-images
DROP POLICY IF EXISTS "product-images-public-read" ON storage.objects;
CREATE POLICY "product-images-public-read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'product-images');

-- Allow anonymous uploads to product-images
DROP POLICY IF EXISTS "product-images-anon-upload" ON storage.objects;
CREATE POLICY "product-images-anon-upload" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated uploads to product-images
DROP POLICY IF EXISTS "product-images-auth-upload" ON storage.objects;
CREATE POLICY "product-images-auth-upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Create site-assets bucket (for logos, banners, etc.)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to site-assets
DROP POLICY IF EXISTS "site-assets-public-read" ON storage.objects;
CREATE POLICY "site-assets-public-read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'site-assets');

-- Allow anonymous uploads to site-assets
DROP POLICY IF EXISTS "site-assets-anon-upload" ON storage.objects;
CREATE POLICY "site-assets-anon-upload" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'site-assets');

-- Allow authenticated uploads to site-assets
DROP POLICY IF EXISTS "site-assets-auth-upload" ON storage.objects;
CREATE POLICY "site-assets-auth-upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'site-assets');

-- ============================================
-- CART SESSIONS TABLE
-- ============================================

-- Create cart_sessions table
CREATE TABLE IF NOT EXISTS cart_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  items jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cart_sessions_all" ON cart_sessions FOR ALL USING (true) WITH CHECK (true);
