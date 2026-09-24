-- =====================================================
-- REDI Food Delivery Platform — Database Schema
-- Supabase / PostgreSQL
-- City: Uyo, Nigeria
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geo queries (nearest rider)

-- =====================================================
-- USERS (synced from Clerk via webhook)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id      TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT NOT NULL DEFAULT '',
  phone         TEXT,
  role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'rider', 'admin')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- FOOD CATEGORIES (e.g. Nigerian, Pizza, Shawarma)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT UNIQUE NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  icon_name     TEXT,              -- Material Symbols icon name
  image_url     TEXT,
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- RESTAURANTS (one per vendor user)
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT,
  logo_url          TEXT,
  cover_url         TEXT,
  address           TEXT NOT NULL DEFAULT 'Uyo, Akwa Ibom',
  city              TEXT NOT NULL DEFAULT 'Uyo',
  lat               DOUBLE PRECISION,
  lng               DOUBLE PRECISION,
  phone             TEXT,
  whatsapp_number   TEXT,
  opening_hours     JSONB,          -- { mon: "8am-10pm", tue: "8am-10pm", ... }
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  avg_rating        DECIMAL(3,2) DEFAULT 0.00,
  total_reviews     INTEGER DEFAULT 0,
  delivery_fee      INTEGER DEFAULT 500,   -- in Naira (kobo-free for simplicity)
  min_order         INTEGER DEFAULT 1000,
  delivery_time_min INTEGER DEFAULT 20,
  delivery_time_max INTEGER DEFAULT 40,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- MENU ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  price           INTEGER NOT NULL,        -- in Naira
  image_url       TEXT,
  is_available    BOOLEAN DEFAULT TRUE,
  is_featured     BOOLEAN DEFAULT FALSE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- RIDERS
-- =====================================================
CREATE TABLE IF NOT EXISTS riders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  is_available      BOOLEAN DEFAULT FALSE,
  current_lat       DOUBLE PRECISION,
  current_lng       DOUBLE PRECISION,
  city              TEXT DEFAULT 'Uyo',
  vehicle_type      TEXT DEFAULT 'motorcycle' CHECK (vehicle_type IN ('motorcycle', 'bicycle', 'car')),
  total_deliveries  INTEGER DEFAULT 0,
  rating            DECIMAL(3,2) DEFAULT 5.00,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ORDERS
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id           UUID NOT NULL REFERENCES users(id),
  restaurant_id         UUID NOT NULL REFERENCES restaurants(id),
  rider_id              UUID REFERENCES riders(id),
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN (
                            'pending',        -- awaiting payment/restaurant
                            'paid',           -- payment successful via Paystack
                            'confirmed',      -- payment confirmed, restaurant notified
                            'accepted',       -- restaurant accepted
                            'preparing',      -- kitchen is cooking
                            'ready',          -- ready for pickup
                            'assigned',       -- rider assigned
                            'picked_up',      -- rider picked up food
                            'delivered',      -- delivered to customer
                            'cancelled'       -- order cancelled
                          )),
  delivery_address      TEXT NOT NULL,
  delivery_lat          DOUBLE PRECISION,
  delivery_lng          DOUBLE PRECISION,
  delivery_notes        TEXT,
  subtotal              INTEGER NOT NULL,     -- in Naira
  delivery_fee          INTEGER NOT NULL,
  total                 INTEGER NOT NULL,
  paystack_reference    TEXT UNIQUE,
  payment_status        TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at          TIMESTAMPTZ,
  accepted_at           TIMESTAMPTZ,
  picked_up_at          TIMESTAMPTZ,
  delivered_at          TIMESTAMPTZ,
  cancelled_at          TIMESTAMPTZ,
  cancellation_reason   TEXT
);

-- =====================================================
-- ORDER ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id    UUID NOT NULL REFERENCES menu_items(id),
  name            TEXT NOT NULL,             -- snapshot of name at time of order
  unit_price      INTEGER NOT NULL,          -- snapshot of price
  quantity        INTEGER NOT NULL DEFAULT 1,
  subtotal        INTEGER NOT NULL,
  special_request TEXT
);

-- =====================================================
-- REVIEWS
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id     UUID NOT NULL REFERENCES users(id),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id),
  order_id        UUID NOT NULL REFERENCES orders(id) UNIQUE,
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- SEED: DEFAULT CATEGORIES FOR UYO
-- =====================================================
INSERT INTO categories (name, slug, icon_name, sort_order) VALUES
  ('Nigerian', 'nigerian', 'skillet', 1),
  ('Rice & Stews', 'rice-stews', 'rice_bowl', 2),
  ('Shawarma', 'shawarma', 'kebab_dining', 3),
  ('Burgers', 'burgers', 'lunch_dining', 4),
  ('Chicken', 'chicken', 'cooking', 5),
  ('Pizza', 'pizza', 'local_pizza', 6),
  ('Drinks', 'drinks', 'local_bar', 7),
  ('Snacks', 'snacks', 'cookie', 8),
  ('Soups', 'soups', 'soup_kitchen', 9),
  ('Dessert', 'dessert', 'icecream', 10)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, restaurants, menu items
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);
CREATE POLICY "Active restaurants are public" ON restaurants FOR SELECT USING (status = 'active');
CREATE POLICY "Menu items are public" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (true);

-- Note: All writes go through service role key via API routes (bypasses RLS)
-- Service role key is server-side only and never exposed to the client
