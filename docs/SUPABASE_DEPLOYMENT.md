# Supabase Deployment & Migration Guide for RawKraft Studio

Follow these steps to connect a production Supabase project to RawKraft Studio.

---

## 1. Create Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** and name it `rawkraft-studio`.
3. Choose the closest region (e.g. `ap-southeast-1` Singapore or `eu-central-1` Frankfurt).
4. Save your Database Password.

---

## 2. Run Database Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor** on the left menu.
2. Click **New Query**.
3. Copy the entire contents of `supabase/migrations/20250101000000_rawkraft_schema.sql` and click **Run**.
4. Create a second query, copy `supabase/seed.sql`, and click **Run** to populate the initial signature pieces (Miro Side Table, Grand Horizon Dining Table, Emerald River Table), default categories, navigation, and theme settings.

---

## 3. Create Storage Bucket for Media
1. In the Supabase Dashboard, go to **Storage** -> **Create a new bucket**.
2. Name the bucket `rawkraft-media`.
3. Set **Public Bucket** to `ON` so product photos are visible on the website.
4. Add a policy allowing authenticated users to upload objects.

---

## 4. Configure Environment Variables
In your Vercel or local environment settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_SITE_URL=https://rawkraftstudio.com
```

---

## 5. Security & Row Level Security (RLS)
The migration file enforces RLS on all tables:
- **Public**: Can read active products, categories, collections, page sections, navigation, and theme settings.
- **Public**: Can submit custom project briefs and place orders.
- **Admin**: Only authenticated staff members present in `team_members` with `is_active = TRUE` can mutate products, inventory, orders, CMS content, and view audit logs.
- Sensitive credentials (e.g. `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`) are kept strictly server-side and never sent to client browsers.
