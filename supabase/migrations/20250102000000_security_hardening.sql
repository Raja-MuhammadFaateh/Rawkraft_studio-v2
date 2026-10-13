-- ==============================================================================
-- RAWKRAFT STUDIO: SECURITY HARDENING & LEAST-PRIVILEGE RLS POLICIES
-- Migration: 20250102000000_security_hardening.sql
-- ==============================================================================

-- 1. ADD PASSWORD HASH & SALT TO TEAM_MEMBERS
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS salt TEXT;

-- 2. HARDENED ROLE LOOKUP FUNCTIONS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION get_user_admin_role()
RETURNS admin_role_type AS $$
DECLARE
    user_role admin_role_type;
BEGIN
    SELECT role INTO user_role
    FROM team_members
    WHERE user_id = auth.uid()
      AND is_active = TRUE
    LIMIT 1;
    
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (get_user_admin_role() = 'OWNER');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_catalog_manager()
RETURNS BOOLEAN AS $$
DECLARE
    r admin_role_type;
BEGIN
    r := get_user_admin_role();
    RETURN (r IN ('OWNER', 'ADMIN', 'CATALOG_MANAGER'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_orders_manager()
RETURNS BOOLEAN AS $$
DECLARE
    r admin_role_type;
BEGIN
    r := get_user_admin_role();
    RETURN (r IN ('OWNER', 'ADMIN', 'ORDERS_MANAGER'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_content_manager()
RETURNS BOOLEAN AS $$
DECLARE
    r admin_role_type;
BEGIN
    r := get_user_admin_role();
    RETURN (r IN ('OWNER', 'ADMIN', 'CONTENT_MANAGER'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. REVOKE DIRECT PUBLIC ORDER INSERTION VIA SUPABASE CLIENT
-- Orders and order items must only be created through server API routes
-- that enforce server-side prices, stock reservations, and calculated totals.
DROP POLICY IF EXISTS "Public can create orders" ON orders;
DROP POLICY IF EXISTS "Public can create order items" ON order_items;

-- 4. HARDEN TEAM MEMBERS PERMISSIONS (PREVENT PRIVILEGE ESCALATION)
-- Only OWNER can add, update, or remove team members. Other admins can only view.
DROP POLICY IF EXISTS "Admin team can manage team members" ON team_members;

CREATE POLICY "Active team members can view team" ON team_members
    FOR SELECT USING (is_admin_member());

CREATE POLICY "Only OWNER can insert team members" ON team_members
    FOR INSERT WITH CHECK (is_owner());

CREATE POLICY "Only OWNER can update team members" ON team_members
    FOR UPDATE USING (is_owner()) WITH CHECK (is_owner());

CREATE POLICY "Only OWNER can delete team members" ON team_members
    FOR DELETE USING (is_owner());

-- 5. IMMUTABLE AUDIT LOGS (NO UPDATE OR DELETE)
DROP POLICY IF EXISTS "Admin team can append audit logs" ON audit_logs;

CREATE POLICY "Admin team can view audit logs" ON audit_logs
    FOR SELECT USING (is_admin_member());

CREATE POLICY "Admin team can append audit logs" ON audit_logs
    FOR INSERT WITH CHECK (is_admin_member());

-- Ensure no UPDATE or DELETE policy exists on audit_logs (append-only enforcement)

-- 6. CONSTRAINTS FOR DATA INTEGRITY
DO $$ BEGIN
    ALTER TABLE products ADD CONSTRAINT chk_products_price_positive CHECK (price_pkr >= 0);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE inventory ADD CONSTRAINT chk_inventory_qty_non_negative CHECK (quantity_on_hand >= 0);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE inventory ADD CONSTRAINT chk_inventory_reserved_non_negative CHECK (quantity_reserved >= 0);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE order_items ADD CONSTRAINT chk_order_items_qty_positive CHECK (quantity > 0);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 7. STORAGE BUCKET CONFIGURATION & POLICIES (IF STORAGE SCHEMA EXISTS)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('rawkraft-media', 'rawkraft-media', true)
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO storage.buckets (id, name, public)
        VALUES ('customer-uploads', 'customer-uploads', false)
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;
