-- Volunteer registrations for The Heritage Cleanliness Project drives.
-- Run this once in the Supabase SQL Editor so the "Register as a Changemaker"
-- form on /events/heritage-cleanliness can store submissions and show them
-- in the admin dashboard (Volunteers tab).

create table if not exists public.heritage_volunteers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  phone       text,
  affiliation text,
  source      text default 'heritage-cleanliness',
  created_at  timestamptz not null default now()
);

create index if not exists heritage_volunteers_created_at_idx
  on public.heritage_volunteers (created_at desc);

-- The API uses the service-role key (server-side only), which bypasses RLS.
-- Enable RLS with no public policies so the table is not readable/writable
-- via the anon key.
alter table public.heritage_volunteers enable row level security;
