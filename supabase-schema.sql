-- SlashFoods Database Schema for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  area TEXT NOT NULL, -- e.g., 'Lekki', 'VI', 'Ikeja'
  phone TEXT NOT NULL,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Anyone can read restaurants
CREATE POLICY "Anyone can view restaurants"
  ON restaurants FOR SELECT
  TO public
  USING (true);

-- Food packs table
CREATE TABLE IF NOT EXISTS food_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  original_price INTEGER NOT NULL,
  discounted_price INTEGER NOT NULL,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  pickup_start_time TEXT NOT NULL, -- e.g., '19:00'
  pickup_end_time TEXT NOT NULL, -- e.g., '21:00'
  available_date DATE NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold_out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE food_packs ENABLE ROW LEVEL SECURITY;

-- Anyone can read available food packs
CREATE POLICY "Anyone can view food packs"
  ON food_packs FOR SELECT
  TO public
  USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_pack_id UUID NOT NULL REFERENCES food_packs(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked_up', 'cancelled')),
  pickup_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  picked_up_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only read their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to decrement food pack quantity
CREATE OR REPLACE FUNCTION decrement_food_pack_quantity(pack_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE food_packs
  SET available_quantity = available_quantity - qty
  WHERE id = pack_id;

  -- Update status if sold out
  UPDATE food_packs
  SET status = 'sold_out'
  WHERE id = pack_id AND available_quantity <= 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing

-- Sample restaurants
INSERT INTO restaurants (id, name, description, address, area, phone) VALUES
  (uuid_generate_v4(), 'Mama Put Lagos', 'Authentic Nigerian home cooking', '23 Admiralty Way, Lekki Phase 1', 'Lekki', '08012345678'),
  (uuid_generate_v4(), 'Bukka Hut VI', 'Local Nigerian cuisine', '15 Adeola Odeku Street', 'VI', '08098765432'),
  (uuid_generate_v4(), 'Yellow Chilli Ikeja', 'Contemporary Nigerian restaurant', '42 Allen Avenue, Ikeja', 'Ikeja', '08011122233'),
  (uuid_generate_v4(), 'Terra Kulture', 'Nigerian cultural cuisine', 'Plot 1376 Tiamiyu Savage Street, VI', 'VI', '08033344455'),
  (uuid_generate_v4(), 'The Place Lekki', 'Grill and smoothie bar', '1 Water Corporation Drive, Oniru', 'Lekki', '08055566677');

-- Sample food packs (you'll need to update the restaurant_id values)
-- This is just a template - adjust dates and restaurant IDs as needed
/*
INSERT INTO food_packs (restaurant_id, title, description, original_price, discounted_price, available_quantity, pickup_start_time, pickup_end_time, available_date)
SELECT
  id,
  'Surprise Nigerian Pack',
  'A delicious surprise mix of Nigerian favorites - could include jollof rice, chicken, plantain, and more!',
  2000,
  800,
  10,
  '19:00',
  '21:00',
  CURRENT_DATE
FROM restaurants
LIMIT 3;
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
