-- Interest / "Notify Me" capture for the next edition of The Living Table.
-- Run this once in the Supabase SQL Editor before the Register Your Interest
-- form on /the-living-table can store submissions.

create table if not exists public.living_table_interest (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  phone       text,
  source      text default 'the-living-table',
  created_at  timestamptz not null default now()
);

create index if not exists living_table_interest_created_at_idx
  on public.living_table_interest (created_at desc);

-- The API uses the service-role key (server-side only), which bypasses RLS.
-- Enable RLS with no public policies so the table is not readable/writable
-- via the anon key.
alter table public.living_table_interest enable row level security;
