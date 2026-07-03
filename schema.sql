-- Initial Supabase PostgreSQL Schema for REDI Platform

-- Enums
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'VENDOR', 'RIDER', 'ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED', 'REJECTED');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT DEFAULT 'OPEN',
    min_order_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Categories (Menu sections for a vendor e.g., "Popular", "Sides")
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    nutrition_info JSONB,
    ingredients TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    label TEXT, -- e.g., 'Home', 'Dorm'
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    delivery_instructions TEXT
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    rider_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    status order_status DEFAULT 'PENDING',
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT, -- 'WALLET', 'CARD', 'CASH'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time DECIMAL(10,2) NOT NULL,
    customizations JSONB -- E.g., {"Size": "Large", "Add-ons": ["Extra Cheese"]}
);

-- Wallets
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet Transactions
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL, -- 'CREDIT', 'DEBIT'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) setup (Boilerplate examples, will be refined in Supabase Dashboard)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Sample Policies
-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vendors/Products: Public read access
CREATE POLICY "Vendors are publicly viewable" ON vendors FOR SELECT USING (true);
CREATE POLICY "Products are publicly viewable" ON products FOR SELECT USING (true);

-- Orders: Customers can view their own, vendors can view theirs, riders can view theirs
CREATE POLICY "Customers can view their orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
