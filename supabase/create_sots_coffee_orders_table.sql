-- Songs of the Stone, Chapter Three (Amrita Kaur · Purana Qila · 10-11 Oct 2026)
-- Coffee pre-order/pickup system. Run this once in the Supabase SQL Editor
-- before /songs-of-the-stone/coffee or its vendor dashboard can take orders.

create table if not exists public.sots_coffee_orders (
  id                      uuid primary key default gen_random_uuid(),

  -- Sequential, human-shown order number. GENERATED ALWAYS AS IDENTITY is
  -- assigned atomically by Postgres at insert time — no app-level MAX()+1
  -- race condition (unlike living_table_tickets.ticket_number; see
  -- supabase/fix_seat_race.sql for that still-unresolved issue — don't repeat it here).
  order_number            integer generated always as identity,

  buyer_name              text not null,
  buyer_phone             text not null,

  -- [{ id, name, qty, unit_price_paise, free_qty }, ...] — snapshot at order
  -- time so a later menu/price edit in lib/sotsCoffee.ts never changes a past order.
  items                   jsonb not null,
  total_qty               integer not null,

  amount_paise            integer not null,          -- final payable amount (0 for fully-free orders)
  original_amount_paise   integer not null,          -- pre-discount amount, for reporting
  discount_paise          integer not null default 0,
  coupon_code             text,

  razorpay_order_id       text,                       -- null for fully-free orders
  razorpay_payment_id     text,
  payment_status          text not null default 'pending'
                           check (payment_status in ('pending', 'paid', 'failed')),

  served                  boolean not null default false,
  served_at               timestamptz,

  created_at              timestamptz not null default now()
);

create index if not exists sots_coffee_orders_status_idx
  on public.sots_coffee_orders (payment_status, served, created_at);

create index if not exists sots_coffee_orders_phone_idx
  on public.sots_coffee_orders (buyer_phone);

-- RLS on, no public policies — only the service-role key (used server-side
-- by the API routes) can read/write. Mirrors living_table_tickets.
alter table public.sots_coffee_orders enable row level security;
