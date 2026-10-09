-- ==============================================================================
-- RAWKRAFT STUDIO: SEED DATA
-- ==============================================================================
-- Seeds signature products (Miro side table, Grand Horizon Dining, etc.),
-- initial categories, default theme settings, navigation, and site settings.
-- ==============================================================================

-- 1. Categories
INSERT INTO categories (id, name, slug, description, image_url, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Dining Tables', 'dining', 'Heirloom live-edge and geometric hardwood dining tables', 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80', 1),
('c1000000-0000-0000-0000-000000000002', 'Coffee & Side Tables', 'coffee-side', 'Sculptural lounge accents and iconic Miro side tables', 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80', 2),
('c1000000-0000-0000-0000-000000000003', 'Consoles & Desks', 'desks-consoles', 'Monolithic executive workspaces and entryway statement pieces', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80', 3),
('c1000000-0000-0000-0000-000000000004', 'Resin & Wood Art', 'resin-art', 'High-clarity crystal epoxy resin river pours and canyon inlays', 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. Collections
INSERT INTO collections (id, name, slug, description, is_featured, sort_order) VALUES
('b1000000-0000-0000-0000-000000000001', 'The Signature Atelier', 'signature-atelier', 'Our most celebrated masterworks and architectural designs', TRUE, 1),
('b1000000-0000-0000-0000-000000000002', 'Ocean & River Inlays', 'ocean-river', 'Crystal UV-stable epoxy rivers blended with natural live slabs', TRUE, 2),
('b1000000-0000-0000-0000-000000000003', 'Nordic Minimalism', 'nordic-minimalism', 'Clean White Oak contours and matte black geometric steel', FALSE, 3)
ON CONFLICT (slug) DO NOTHING;

-- 3. Products
INSERT INTO products (
    id, name, slug, sku, short_description, full_description, status, product_type,
    price_pkr, price_usd, category_id, dimensions, is_signature, is_popular,
    primary_wood, available_woods, primary_leg_style, available_leg_styles,
    has_resin_option, default_resin_color, image_url, lead_time_weeks
) VALUES
(
    'p1000000-0000-0000-0000-000000000001',
    'Miro Side Table',
    'miro-side-table',
    'RK-MIRO-01',
    'Signature geometric accent table with natural live timber and matte black metal',
    'The signature Miro side table is the epitome of RawKraft Studio’s craft philosophy: pure natural solid wood grain suspended over handcrafted architectural matte black metal.',
    'active',
    'made_to_order',
    28500.00,
    105.00,
    'c1000000-0000-0000-0000-000000000002',
    '18" Dia x 21" Height',
    TRUE,
    TRUE,
    'Natural Sheesham Rosewood',
    '{"Natural Sheesham Rosewood", "American Walnut", "White Oak", "Golden Teak"}',
    'Matte Black Geometric Steel',
    '{"Matte Black Geometric Steel", "Brushed Brass Accent", "Minimalist Tripod"}',
    TRUE,
    'Clear Natural Oil (No Resin)',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    '2 - 3 weeks'
),
(
    'p1000000-0000-0000-0000-000000000002',
    'Grand Horizon Walnut Dining Table',
    'grand-walnut-dining',
    'RK-GRD-02',
    'Bookmatched live-edge American walnut slab with architectural spider base',
    'A true generational centerpiece. Each Grand Horizon table is crafted from seasoned American Black Walnut with preserved natural live edges, stabilized with subtle hand-carved brass bowtie inlays.',
    'active',
    'made_to_order',
    195000.00,
    695.00,
    'c1000000-0000-0000-0000-000000000001',
    '84" L x 38" W x 30" H (Seats 8)',
    TRUE,
    FALSE,
    'American Black Walnut',
    '{"American Black Walnut", "Golden Sheesham", "White Oak"}',
    'Matte Black Spider Starburst Base',
    '{"Matte Black Spider Starburst Base", "Heavy U-Frames", "Trapezoid Industrial"}',
    FALSE,
    NULL,
    'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    '3 - 4 weeks'
),
(
    'p1000000-0000-0000-0000-000000000003',
    'Emerald Depths River Coffee Table',
    'emerald-river-coffee',
    'RK-EMR-03',
    'Live-edge Sheesham slabs cast in jewel-tone emerald translucent epoxy resin',
    'Two opposing live-edge Sheesham slabs linked by a river of jewel-toned emerald crystal epoxy. Polished up to 3000 grit for glass-like clarity with a silky-touch scratch-resistant surface.',
    'active',
    'made_to_order',
    68000.00,
    245.00,
    'c1000000-0000-0000-0000-000000000004',
    '42" L x 24" W x 18" H',
    FALSE,
    TRUE,
    'Natural Sheesham Rosewood',
    '{"Natural Sheesham Rosewood", "American Walnut", "White Oak"}',
    'Matte Black U-Legs',
    '{"Matte Black U-Legs", "Brushed Brass Metal Legs", "Square Box Steel"}',
    TRUE,
    'Emerald Forest Green River',
    'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    '3 - 4 weeks'
),
(
    'p1000000-0000-0000-0000-000000000004',
    'Obsidian Live-Edge Executive Desk',
    'obsidian-executive-desk',
    'RK-OBS-04',
    'Monolithic live edge hardwood desk with integrated wire management and cantilever legs',
    'Engineered for distinguished workspaces. Massive solid hardwood slab with an organic front live edge and squared workspace boundary, supported by cantilevered industrial steel.',
    'active',
    'made_to_order',
    145000.00,
    520.00,
    'c1000000-0000-0000-0000-000000000003',
    '66" L x 30" W x 30" H',
    FALSE,
    FALSE,
    'American Black Walnut',
    '{"American Black Walnut", "Sheesham Rosewood", "White Oak"}',
    'Cantilever Industrial Black Steel',
    '{"Cantilever Industrial Black Steel", "Box Profile Frame", "Fluted Metal Pedestal"}',
    TRUE,
    'Smoked Obsidian River',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
    '3 - 4 weeks'
)
ON CONFLICT (sku) DO NOTHING;

-- 4. Initial Inventory for Products
INSERT INTO inventory (product_id, track_inventory, quantity_on_hand, quantity_reserved, low_stock_threshold) VALUES
('p1000000-0000-0000-0000-000000000001', TRUE, 4, 1, 2),
('p1000000-0000-0000-0000-000000000002', TRUE, 2, 0, 1),
('p1000000-0000-0000-0000-000000000003', TRUE, 3, 0, 1),
('p1000000-0000-0000-0000-000000000004', TRUE, 1, 0, 1)
ON CONFLICT (product_id) DO NOTHING;

-- 5. Site Settings
INSERT INTO site_settings (key, value, description) VALUES
('business_info', '{"name": "RawKraft Studio", "tagline": "Bespoke Solid Hardwood & Live-Edge Atelier", "phone": "+92 331 7497444", "whatsapp": "+92 331 7497444", "whatsapp_raw": "+923317497444", "email": "info@rawkraftstudio.com", "city": "Rawalpindi / Islamabad", "country": "Pakistan", "instagram": "https://www.instagram.com/rawkraft_studio", "facebook": "https://www.facebook.com/share/1J5U7xyPwT/"}', 'General business and contact details'),
('shipping_policy', '{"delivery_scope": "Nationwide Pakistan crated freight", "lead_time": "3-4 weeks", "deposit_pct": 50}', 'Shipping and delivery terms'),
('seo_defaults', '{"title": "RawKraft Studio | Bespoke Handcrafted Furniture & Live-Edge Slabs", "description": "Premium bespoke furniture studio website with interactive catalog, custom piece configurator, WhatsApp brief builder, and studio AI design consultant."}', 'Default SEO meta tags')
ON CONFLICT (key) DO NOTHING;

-- 6. Navigation Items
INSERT INTO navigation_items (menu_location, label, url, is_external, is_enabled, sort_order) VALUES
('header', 'Shop Catalog', '/shop', FALSE, TRUE, 1),
('header', 'Custom Studio', '/custom', FALSE, TRUE, 2),
('header', 'RawKraft AI', '/ai', FALSE, TRUE, 3),
('header', 'Our Craft', '/#philosophy', FALSE, TRUE, 4),
('footer', 'All Furniture', '/shop', FALSE, TRUE, 1),
('footer', 'Live Edge Dining', '/shop?cat=dining', FALSE, TRUE, 2),
('footer', 'Miro Side Table', '/shop?cat=coffee-side', FALSE, TRUE, 3),
('footer', 'Custom Brief Studio', '/custom', FALSE, TRUE, 4),
('footer', 'RawKraft AI Advisor', '/ai', FALSE, TRUE, 5)
ON CONFLICT DO NOTHING;
