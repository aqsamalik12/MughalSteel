-- ==============================================================================
-- Mughal Steel Fabrication - Supabase Database Schema
-- Run this in the Supabase Dashboard -> SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    product_code TEXT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    sku TEXT,
    category TEXT,
    subcategory TEXT,
    item TEXT,
    description TEXT,
    short_description TEXT,
    price_per_sqft NUMERIC DEFAULT 0,
    base_price NUMERIC DEFAULT 0,
    sale_price NUMERIC,
    featured BOOLEAN DEFAULT true,
    new_arrival BOOLEAN DEFAULT false,
    on_sale BOOLEAN DEFAULT false,
    images JSONB DEFAULT '[]'::jsonb,
    front_image TEXT,
    back_image TEXT,
    side_image TEXT,
    detail_image TEXT,
    installation_image TEXT,
    materials JSONB DEFAULT '[]'::jsonb,
    finishes JSONB DEFAULT '[]'::jsonb,
    glass_options JSONB DEFAULT '[]'::jsonb,
    hardware_options JSONB DEFAULT '[]'::jsonb,
    customization JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC DEFAULT 5.0,
    stock INTEGER DEFAULT 10,
    availability TEXT DEFAULT 'In Stock',
    style TEXT,
    application TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. QUOTES TABLE
CREATE TABLE IF NOT EXISTS public.quotes (
    id TEXT PRIMARY KEY,
    quote_number TEXT,
    customer_name TEXT,
    customer_first_name TEXT,
    customer_last_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    city TEXT,
    project_type TEXT,
    project_category TEXT,
    item_type TEXT,
    product_code TEXT,
    width NUMERIC DEFAULT 12,
    height NUMERIC DEFAULT 7.5,
    quantity INTEGER DEFAULT 1,
    total_area NUMERIC DEFAULT 90,
    rate_per_sqft NUMERIC DEFAULT 2800,
    estimated_price NUMERIC,
    notes TEXT,
    reference_images JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT,
    customer_email TEXT,
    customer_first_name TEXT,
    customer_last_name TEXT,
    customer_phone TEXT,
    shipping_street TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_zip TEXT,
    shipping_country TEXT,
    subtotal NUMERIC DEFAULT 0,
    shipping_cost NUMERIC DEFAULT 0,
    tax NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    order_status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'unpaid',
    payment_method TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    user_name TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    title TEXT,
    comment TEXT NOT NULL,
    date TEXT,
    verified BOOLEAN DEFAULT true,
    approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.website_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    company_name TEXT DEFAULT 'Mughal Steel Fabrication',
    tagline TEXT,
    phone TEXT,
    whatsapp_number TEXT,
    email TEXT,
    support_email TEXT,
    street_address TEXT,
    suite TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'Pakistan',
    business_hours TEXT,
    google_maps_url TEXT,
    shipping_charge NUMERIC DEFAULT 5000,
    free_shipping_threshold NUMERIC DEFAULT 500000,
    tax_rate NUMERIC DEFAULT 0.0,
    social_links JSONB DEFAULT '{}'::jsonb,
    logo_url TEXT,
    currency TEXT DEFAULT 'PKR',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    author TEXT,
    date TEXT,
    read_time TEXT,
    image TEXT,
    category TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image TEXT,
    project_type TEXT,
    location TEXT,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES (Allow public read and write with anon key)
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Upsert Products" ON public.products FOR ALL USING (true);

CREATE POLICY "Public Read Quotes" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Public Insert Quotes" ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Quotes" ON public.quotes FOR UPDATE USING (true);

CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Public Insert Contact Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Contact Messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Public Update Contact Messages" ON public.contact_messages FOR UPDATE USING (true);

CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Reviews" ON public.reviews FOR UPDATE USING (true);

CREATE POLICY "Public Read Settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public Upsert Settings" ON public.website_settings FOR ALL USING (true);

CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public Upsert Blogs" ON public.blogs FOR ALL USING (true);

CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public Upsert Testimonials" ON public.testimonials FOR ALL USING (true);
