-- ==============================================================================
-- RAWKRAFT STUDIO: PRODUCTION RELATIONAL DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Designed for Supabase PostgreSQL. Supports UUID primary keys, audit logs,
-- granular RBAC permissions, inventory movement ledger, CMS sections,
-- and ecommerce order workflows.
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE admin_role_type AS ENUM (
        'OWNER',
        'ADMIN',
        'CATALOG_MANAGER',
        'CONTENT_MANAGER',
        'ORDERS_MANAGER',
        'AI_MANAGER',
        'VIEWER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_status_type AS ENUM ('draft', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_type_enum AS ENUM ('ready_stock', 'made_to_order', 'custom', 'service');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inventory_movement_type AS ENUM (
        'initial_stock',
        'purchase',
        'manual_adjustment',
        'reservation',
        'release',
        'sale',
        'return',
        'damaged',
        'correction'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM (
        'pending',
        'confirmed',
        'processing',
        'ready',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM (
        'pending',
        'paid',
        'failed',
        'refunded',
        'partially_refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enquiry_status_type AS ENUM (
        'new',
        'reviewing',
        'contacted',
        'quoted',
        'approved',
        'rejected',
        'completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. USERS, ROLES & PERMISSIONS
-- ------------------------------------------------------------------------------

-- Profiles: extends auth.users with RawKraft specific metadata
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team members with role assignment
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role admin_role_type NOT NULL DEFAULT 'VIEWER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);

-- ------------------------------------------------------------------------------
-- 3. AUDIT LOGS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    before_data JSONB,
    after_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. CATEGORIES & COLLECTIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS & VARIANTS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    status product_status_type NOT NULL DEFAULT 'draft',
    product_type product_type_enum NOT NULL DEFAULT 'made_to_order',
    
    -- Commercial
    price_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    sale_price_pkr NUMERIC(12, 2),
    price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'PKR',
    is_quote_only BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Categorization
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    is_signature BOOLEAN NOT NULL DEFAULT FALSE,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Manufacturing
    lead_time_weeks TEXT DEFAULT '3-4 weeks',
    is_customizable BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Specifications
    dimensions TEXT,
    weight_kg NUMERIC(6, 2),
    primary_wood TEXT NOT NULL DEFAULT 'Natural Sheesham Rosewood',
    available_woods TEXT[] DEFAULT '{"Natural Sheesham Rosewood", "American Walnut", "White Oak", "Golden Teak"}',
    primary_leg_style TEXT NOT NULL DEFAULT 'Matte Black Geometric Steel',
    available_leg_styles TEXT[] DEFAULT '{"Matte Black Geometric Steel", "Spider Starburst Base", "Heavy U-Frames", "Brushed Brass Accent"}',
    has_resin_option BOOLEAN NOT NULL DEFAULT FALSE,
    default_resin_color TEXT,
    available_resin_colors TEXT[] DEFAULT '{"Deep Ocean Blue", "Emerald Forest Green", "Smoked Obsidian Black", "Crystal Clear Water"}',
    
    -- Primary Image
    image_url TEXT NOT NULL,
    
    -- AI Metadata
    ai_suitable_rooms TEXT[] DEFAULT '{"Dining Room", "Living Room", "Executive Office"}',
    ai_style_tags TEXT[] DEFAULT '{"Modern Organic", "Industrial Luxury", "Live Edge"}',
    ai_search_summary TEXT,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- Product Collections Junction
CREATE TABLE IF NOT EXISTS product_collections (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (product_id, collection_id)
);

-- Product Media
CREATE TABLE IF NOT EXISTS product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image', -- 'image' | 'video'
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_media_product ON product_media(product_id, sort_order);

-- Media Assets Library
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    width INT,
    height INT,
    public_url TEXT NOT NULL,
    folder TEXT NOT NULL DEFAULT 'general',
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. INVENTORY & MOVEMENTS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    track_inventory BOOLEAN NOT NULL DEFAULT TRUE,
    quantity_on_hand INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 2,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    movement_type inventory_movement_type NOT NULL,
    quantity_change INT NOT NULL,
    quantity_after INT NOT NULL,
    reason TEXT,
    reference_id TEXT, -- e.g. order_id
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    performed_by_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_prod ON inventory_movements(product_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. CUSTOMERS & ORDERS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    notes TEXT,
    total_orders INT NOT NULL DEFAULT 0,
    total_spend_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_city TEXT NOT NULL,
    shipping_address TEXT,
    
    order_status order_status_type NOT NULL DEFAULT 'pending',
    payment_status payment_status_type NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT 'bank_transfer', -- 'bank_transfer' | 'cod' | 'whatsapp' | 'card'
    
    subtotal_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    
    notes TEXT,
    whatsapp_notified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price_pkr NUMERIC(12, 2) NOT NULL,
    total_price_pkr NUMERIC(12, 2) NOT NULL,
    custom_wood TEXT,
    custom_legs TEXT,
    custom_resin TEXT,
    custom_dimensions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ------------------------------------------------------------------------------
-- 8. CUSTOM PROJECT ENQUIRIES (FROM /custom)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS custom_project_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT NOT NULL,
    
    furniture_type TEXT NOT NULL,
    wood_species TEXT NOT NULL,
    edge_profile TEXT NOT NULL,
    resin_option TEXT NOT NULL,
    leg_style TEXT NOT NULL,
    
    length_inches NUMERIC(6, 2) NOT NULL,
    width_inches NUMERIC(6, 2) NOT NULL,
    height_inches NUMERIC(6, 2) NOT NULL,
    
    estimated_price_pkr NUMERIC(12, 2) NOT NULL,
    customer_notes TEXT,
    reference_images TEXT[] DEFAULT '{}',
    
    status enquiry_status_type NOT NULL DEFAULT 'new',
    admin_notes TEXT,
    whatsapp_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_enquiries_status ON custom_project_requests(status);
CREATE INDEX IF NOT EXISTS idx_custom_enquiries_created ON custom_project_requests(created_at DESC);

-- ------------------------------------------------------------------------------
-- 9. AI CONSULTATIONS & KNOWLEDGE DOCUMENTS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    user_identifier TEXT,
    user_query TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    matched_knowledge_ids TEXT[] DEFAULT '{}',
    recommended_product_ids UUID[] DEFAULT '{}',
    source_used TEXT DEFAULT 'gemini-2.5-flash',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_consultations_created ON ai_consultations(created_at DESC);

CREATE TABLE IF NOT EXISTS ai_knowledge_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. CMS: PAGES, SECTIONS, NAVIGATION, THEME & SETTINGS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- 'hero' | 'featured_products' | 'editorial' | 'materials' | 'process' | 'cta'
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    cta_label TEXT,
    cta_url TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_location TEXT NOT NULL DEFAULT 'header', -- 'header' | 'footer'
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    is_external BOOLEAN NOT NULL DEFAULT FALSE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS theme_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'RawKraft Luxe Dark',
    primary_color TEXT NOT NULL DEFAULT '#c89d66',
    secondary_color TEXT NOT NULL DEFAULT '#b58952',
    background_color TEXT NOT NULL DEFAULT '#0f1012',
    surface_color TEXT NOT NULL DEFAULT '#17191d',
    card_color TEXT NOT NULL DEFAULT '#1e2126',
    border_color TEXT NOT NULL DEFAULT '#2c313a',
    text_color TEXT NOT NULL DEFAULT '#f3f4f6',
    muted_text_color TEXT NOT NULL DEFAULT '#8e96a4',
    heading_font TEXT NOT NULL DEFAULT 'Playfair Display',
    body_font TEXT NOT NULL DEFAULT 'Inter',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_team_members_updated BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_collections_updated BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_inventory_updated BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_custom_projects_updated BEFORE UPDATE ON custom_project_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Is current user an active admin team member
CREATE OR REPLACE FUNCTION is_admin_member()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM team_members
        WHERE user_id = auth.uid()
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PUBLIC READ POLICIES (Only published/active rows are public)
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view active collections" ON collections
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view product media" ON product_media
    FOR SELECT USING (TRUE);

CREATE POLICY "Public can view published pages" ON pages
    FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Public can view enabled page sections" ON page_sections
    FOR SELECT USING (is_enabled = TRUE);

CREATE POLICY "Public can view enabled navigation" ON navigation_items
    FOR SELECT USING (is_enabled = TRUE);

CREATE POLICY "Public can view active theme" ON theme_settings
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view public site settings" ON site_settings
    FOR SELECT USING (TRUE);

-- PUBLIC INSERT POLICIES (e.g. creating enquiries and orders)
CREATE POLICY "Public can submit custom project enquiries" ON custom_project_requests
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public can create order items" ON order_items
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public can log ai consultations" ON ai_consultations
    FOR INSERT WITH CHECK (TRUE);

-- ADMIN FULL ACCESS POLICIES
CREATE POLICY "Admin team has full access to products" ON products
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to categories" ON categories
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to collections" ON collections
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to inventory" ON inventory
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to inventory movements" ON inventory_movements
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to orders" ON orders
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to order items" ON order_items
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to customers" ON customers
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to custom enquiries" ON custom_project_requests
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to ai consultations" ON ai_consultations
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to ai knowledge" ON ai_knowledge_documents
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to cms pages" ON pages
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to page sections" ON page_sections
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to navigation" ON navigation_items
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to site settings" ON site_settings
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to theme settings" ON theme_settings
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team has full access to media assets" ON media_assets
    FOR ALL USING (is_admin_member());

CREATE POLICY "Admin team can view audit logs" ON audit_logs
    FOR SELECT USING (is_admin_member());

CREATE POLICY "Admin team can append audit logs" ON audit_logs
    FOR INSERT WITH CHECK (is_admin_member());

CREATE POLICY "Admin team can manage team members" ON team_members
    FOR ALL USING (is_admin_member());
