-- ============================================================================
--  Mina Salama / Grees — Supabase schema
-- ============================================================================
--  Run this ONCE in the Supabase SQL editor (Dashboard → SQL → New query).
--  It is idempotent: safe to re-run. After running, create a PUBLIC storage
--  bucket named exactly `product-images` (Dashboard → Storage → New bucket,
--  "Public bucket" checked) so uploaded product photos are web-accessible.
--
--  Security model: the app talks to these tables ONLY from the server using the
--  service-role key, which bypasses RLS. We still enable RLS with NO public
--  policies, so even if the anon/public key were ever exposed, none of this
--  data (leads, analytics) could be read or written from the browser.
-- ============================================================================

-- Needed for gen_random_uuid().
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
--  Products
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  category_slug    text not null,
  subcategory_slug text not null,
  summary          text not null default '',
  description      text not null default '',
  -- Image gallery: array of { src, alt, width, height }. First image is cover.
  images           jsonb not null default '[]'::jsonb,
  -- Array of { name, description? }.
  materials        jsonb not null default '[]'::jsonb,
  -- { width, depth, height, seatHeight?, unit }.
  dimensions       jsonb not null default '{}'::jsonb,
  collection       text,
  is_featured      boolean not null default false,
  is_new           boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_slug);
create index if not exists products_featured_idx  on public.products (is_featured);
create index if not exists products_new_idx        on public.products (is_new);

-- ----------------------------------------------------------------------------
--  Inquiries (contact-form leads)
-- ----------------------------------------------------------------------------
create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  message         text not null,
  product_slug    text,
  -- Visitor-declared gender ('male' | 'female' | 'unspecified').
  gender          text,
  -- Name-based gender guess + 0..1 confidence (fallback when not declared).
  gender_guess    text,
  gender_confidence real,
  -- Lead lifecycle.
  is_read         boolean not null default false,
  -- Lightweight context captured server-side (never shown publicly).
  country         text,
  city            text,
  referrer        text,
  device          text,
  browser         text,
  created_at      timestamptz not null default now()
);

create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
create index if not exists inquiries_read_idx     on public.inquiries (is_read);

-- ----------------------------------------------------------------------------
--  Visit events (privacy-respecting page-view analytics)
-- ----------------------------------------------------------------------------
--  We store NO raw IP address. `visitor_hash` is a salted daily hash so we can
--  count unique visitors per day without being able to identify anyone.
create table if not exists public.visit_events (
  id            bigint generated always as identity primary key,
  path          text not null,
  referrer_host text,
  country       text,
  city          text,
  device        text,    -- 'mobile' | 'tablet' | 'desktop' | 'bot'
  browser       text,
  os            text,
  -- Salted daily hash of (ip + ua + date). Lets us de-dupe unique visitors
  -- per day; cannot be reversed to an IP.
  visitor_hash  text,
  created_at    timestamptz not null default now()
);

create index if not exists visit_events_created_idx on public.visit_events (created_at desc);
create index if not exists visit_events_path_idx     on public.visit_events (path);
create index if not exists visit_events_country_idx  on public.visit_events (country);

-- ----------------------------------------------------------------------------
--  Row Level Security: lock everything down. Service-role bypasses RLS, so the
--  server keeps full access while the public/anon key gets nothing.
-- ----------------------------------------------------------------------------
alter table public.products     enable row level security;
alter table public.inquiries    enable row level security;
alter table public.visit_events enable row level security;
-- No policies are created on purpose → anon/public role has zero access.

-- ----------------------------------------------------------------------------
--  Keep products.updated_at fresh on every update.
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();
