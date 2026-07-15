-- Newsletter subscribers captured from the "Stay Connected" form on the homepage.
-- Run this once in the Supabase SQL Editor so subscriptions are stored and show
-- in the admin dashboard (Subscribers tab).

create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text default 'homepage',
  created_at  timestamptz not null default now()
);

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

-- The API uses the service-role key (server-side only), which bypasses RLS.
-- Enable RLS with no public policies so the table is not readable/writable
-- via the anon key.
alter table public.newsletter_subscribers enable row level security;
