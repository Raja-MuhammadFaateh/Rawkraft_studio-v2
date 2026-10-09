# RawKraft Studio: Admin Dashboard & Backend Setup Guide

This document describes how to configure, run, and administer the RawKraft Studio production-grade Admin Dashboard and database foundation.

---

## 1. Quick Start & Staff Access

From the root directory:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Accessing the Admin Portal
- Navigate to: `http://localhost:3000/admin`
- Unauthenticated requests are securely redirected to `/admin/login`.

### Preconfigured Studio Accounts
For initial development and bootstrap administration, the following accounts are provisioned:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **OWNER** | `faateh2006@gmail.com` | `rawkraft2025` | Unrestricted full ownership, team invites, RBAC |
| **ADMIN** | `admin@rawkraftstudio.com` | `rawkraft2025` | Products, inventory, orders, CMS, styling, media |

---

## 2. Admin Dashboard Capabilities

The Admin Dashboard provides full, code-free business management:

1. **Dashboard Overview (`/admin`)**:
   - Executive sales volume (PKR), active order states, inventory low-stock alerts, and custom commission briefs.
   - Real-time immutable audit stream recording staff actions.

2. **Product Catalog (`/admin/products`, `/admin/products/new`, `/admin/products/[id]`)**:
   - 10-section professional product editor (General, Commercial Pricing, Inventory, Specifications, Materials, Customization, Media, SEO, AI Metadata, Publishing).
   - Instant duplication, draft-saving, deletion confirmation, and SKU generation.

3. **Inventory & Movement Ledger (`/admin/inventory`)**:
   - Tracks On Hand, Reserved, Available, and Low Stock Thresholds.
   - Every stock adjustment requires a movement type (`purchase`, `manual_adjustment`, `reservation`, `damaged`, `correction`) and recorded reason.

4. **Categories & Collections (`/admin/categories`, `/admin/collections`)**:
   - Create, edit, and organize furniture classifications and featured marketing collections.

5. **Client Orders (`/admin/orders`)**:
   - Track client orders with multi-stage production statuses (`pending`, `confirmed`, `processing`, `ready`, `shipped`, `delivered`).
   - One-click client WhatsApp messaging with pre-populated order context.

6. **Custom Project Enquiries (`/admin/enquiries`)**:
   - Ingests briefs from the public `/custom` interactive room builder.
   - Tracks dimensions, wood species, epoxy river styles, and estimated quotes.

7. **AI Consultations & Knowledge (`/admin/ai`)**:
   - Audits client conversations with the studio AI consultant.
   - Inspects grounding knowledge documents (timber moisture, Shore D hardness, heat thresholds).

8. **Homepage & CMS (`/admin/content`)**:
   - Controlled block editor for hero headlines, editorial banners, and CTA links without risk of broken markup.

9. **Media Library (`/admin/media`)**:
   - Uploads with server-side magic-bytes signature verification (JPEG, PNG, WEBP).

10. **Theme & Typography (`/admin/appearance`)**:
    - Structured color pickers (Primary accent `#c89d66`, dark surfaces, fonts) with CSS injection protection.

11. **Navigation Menus (`/admin/navigation`)**:
    - Manage Header and Footer menus with link validation (blocks dangerous schemes like `javascript:`).

12. **Settings & Policies (`/admin/settings`)**:
    - Studio address, WhatsApp phone number, Instagram/Facebook URLs, and crated delivery terms.

13. **Team & RBAC (`/admin/team`)**:
    - Assign roles: `OWNER`, `ADMIN`, `CATALOG_MANAGER`, `CONTENT_MANAGER`, `ORDERS_MANAGER`, `AI_MANAGER`, `VIEWER`.

14. **Audit Log (`/admin/activity`)**:
    - Append-only security audit log recording before/after JSON diffs.

---

## 3. Database Architecture (Supabase PostgreSQL)

The database schema is defined in:
- `supabase/migrations/20250101000000_rawkraft_schema.sql`
- `supabase/seed.sql`

When `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided in `.env.local`, the application queries Supabase directly with Row Level Security (RLS). Without Supabase configured, the included data repository layer persists in-memory and ensures zero downtime during local development.
