-- SlashFood Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Partners table (restaurants, stores, etc.)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    business_type VARCHAR(50) DEFAULT 'restaurant', -- restaurant, bakery, supermarket, etc.
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- restaurant, bakery, supermarket, etc.
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage INTEGER GENERATED ALWAYS AS (
        ROUND(((original_price - discounted_price) / original_price * 100))
    ) STORED,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    pickup_start_time TIME NOT NULL,
    pickup_end_time TIME NOT NULL,
    pickup_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) UNIQUE NOT NULL, -- Human readable order ID like SL-ABC123
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL, -- Denormalized for quick access
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    pickup_code VARCHAR(4) NOT NULL, -- 4-digit pickup code
    payment_method VARCHAR(50) DEFAULT 'flutterwave',
    payment_reference VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    order_status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, ready, picked_up, expired
    pickup_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table (deals in each order)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id),
    partner_id UUID REFERENCES partners(id),
    deal_title VARCHAR(255) NOT NULL, -- Denormalized for order history
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_partners_location ON partners(latitude, longitude);
CREATE INDEX idx_partners_active ON partners(is_active);
CREATE INDEX idx_deals_partner ON deals(partner_id);
CREATE INDEX idx_deals_active ON deals(is_active);
CREATE INDEX idx_deals_category ON deals(category);
CREATE INDEX idx_deals_pickup_date ON deals(pickup_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_pickup_code ON orders(pickup_code);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for deals and partners (for customer app)
CREATE POLICY "Allow public read access to active partners" ON partners FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active deals" ON deals FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert their own partner records
CREATE POLICY "Allow users to insert their own partner record" ON partners FOR INSERT WITH CHECK (auth.email() = email);

-- Customers can only see their own orders
CREATE POLICY "Customers can view their own orders" ON orders FOR SELECT USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow public insert for customers and orders (for new registrations/orders)
CREATE POLICY "Allow public insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert order_items" ON order_items FOR INSERT WITH CHECK (true);