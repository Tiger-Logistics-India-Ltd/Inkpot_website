-- Songs of the Stone coffee orders now span two sessions (10 Oct evening,
-- 11 Oct morning) with per-session caps. Safe to re-run — every step is
-- idempotent, so running this twice (or on a table that already has it) is a
-- no-op rather than an error.

alter table public.sots_coffee_orders
  add column if not exists session text;

update public.sots_coffee_orders
  set session = 'oct10-evening'
  where session is null;

alter table public.sots_coffee_orders
  alter column session set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'sots_coffee_orders_session_check'
  ) then
    alter table public.sots_coffee_orders
      add constraint sots_coffee_orders_session_check
      check (session in ('oct10-evening', 'oct11-morning'));
  end if;
end $$;

create index if not exists sots_coffee_orders_session_idx
  on public.sots_coffee_orders (session, payment_status);
