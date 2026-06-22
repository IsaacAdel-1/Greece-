# Admin Dashboard — Setup & Guide

The site has a full owner dashboard at **`/admin`**. It works in two modes:

- **Without Supabase** (fresh clone / local dev): everything runs, but data
  (products, inquiries, visits) is kept in memory and resets when the server
  restarts. Good for trying it out.
- **With Supabase** (recommended for production): everything is durable.

---

## 1. Opening the dashboard

1. Start the site: `npm run dev` → open the printed URL (e.g. `http://localhost:3000`).
2. Go to **`/admin/login`**.
3. Enter the password from your `.env.local` → `ADMIN_PASSWORD` (currently `test1234` in dev — **change it** before going live).

Sections: **Dashboard** (stats), **Products** (catalogue CRUD), **Inquiries**
(leads), **Visitors** (analytics).

---

## 2. Connecting Supabase (makes everything durable)

1. Create a free project at <https://supabase.com>.
2. **Project Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never public)
3. **SQL Editor → New query** → paste the contents of
   [`src/lib/supabase/schema.sql`](src/lib/supabase/schema.sql) → **Run**.
4. **Storage → New bucket** → name it exactly `product-images` → tick **Public bucket**.
5. Put the keys in `.env.local` (and in Vercel → Project → Settings → Environment Variables):

   ```
   SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...        # service_role secret
   SUPABASE_STORAGE_BUCKET=product-images
   ADMIN_PASSWORD=choose-a-strong-password
   AUTH_SECRET=run: openssl rand -hex 32
   ```
6. Restart the server. The dashboard banners that say "Supabase isn't configured"
   will disappear.

---

## 3. Adding products

**Products → + Add product.** Fill name, slug (URL, lowercase-with-hyphens),
category/subcategory, summary, description, dimensions, materials, and **upload
images** (first image is the cover). Save.

- The first time, if your database is empty, click **Import starter catalogue**
  to copy the built-in demo pieces into Supabase, then edit them.
- Edit/Delete from each product card.

> After adding products in production on Vercel, redeploy (or it auto-redeploys
> on git push) so the new product detail pages are pre-rendered. Existing pages
> update immediately.

---

## 4. Visitor analytics

Every page view (real humans, bots excluded) is recorded with: page, country &
city (from Vercel's edge headers — live once deployed to Vercel), device,
browser, OS, and traffic source (referrer). See **Visitors** (7/30/90-day ranges)
and the dashboard charts.

**Privacy:** no raw IP address is ever stored. Unique visitors are counted with a
salted hash that rotates daily, so visitors can't be tracked across days.

---

## 5. Visitor gender

There is **no reliable way to know an anonymous browser's gender** — no honest
method exists. So:

- The contact form has an **optional** "Gender" field people can self-select.
- When it's left blank, we show a **best-effort guess from the first name** (Arabic
  + English dictionaries), always labelled as an estimate with a confidence %.

You see this per-lead on the **Inquiries** page and aggregated in **Dashboard →
Leads by gender**. Treat the guessed values as approximate.

---

## 6. Security notes

- `/admin` and all `/api/admin/*` routes are gated by an HMAC-signed, httpOnly,
  SameSite=Lax session cookie (middleware-enforced).
- Admin mutations and the tracking endpoint require a **same-origin** request
  (CSRF defense-in-depth).
- The Supabase **service-role key is server-only** (guarded by `server-only`;
  the build fails if it's ever imported into client code). Database tables have
  RLS enabled with no public policies, so the anon key can't read leads/analytics.
- Login is rate-limited per IP; so are the inquiry and tracking endpoints.
- Set a strong `ADMIN_PASSWORD` and a random `AUTH_SECRET` before launch.

> `npm audit` reports issues in **dev tooling only** (esbuild/vite/vitest/postcss).
> These don't ship to the deployed site. Don't run `npm audit fix --force` — it
> would downgrade Next.js.
