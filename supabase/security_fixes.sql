-- ─────────────────────────────────────────────────────────────────────────
-- Supabase Security Advisor fixes for The Living Table
-- Run once in Supabase → SQL Editor → New query → Run.
--
-- SAFE FOR THE APP: every table is accessed only through the server-side
-- SERVICE-ROLE key (lib/supabase.ts). The service role BYPASSES RLS and view
-- security, so these changes only lock out the public anon key (the internet)
-- — they do NOT affect any /api route, the booking flow, admin, or the
-- interest form. Verified: no client-side or anon Supabase usage anywhere.
-- ─────────────────────────────────────────────────────────────────────────

-- 1. CRITICAL — RLS Disabled in Public: living_table_coupons
--    Without RLS, anyone with the public anon key could read/modify coupons.
--    Coupon validation/increment runs via the service role, so this is safe.
alter table public.living_table_coupons enable row level security;

-- 2. CRITICAL — Security Definer View: living_table_stats
--    A SECURITY DEFINER view runs with the owner's rights, bypassing the
--    caller's RLS. Switch it to SECURITY INVOKER so anon callers are subject
--    to RLS; the admin dashboard reads it via the service role, which still
--    sees all rows. (Requires Postgres 15+, which Supabase runs.)
alter view public.living_table_stats set (security_invoker = on);

-- 3. WARN — Function Search Path Mutable: assign_seats_atomic
--    Pin the search_path so the function can't be hijacked via a mutable
--    search_path. Behaviour is unchanged.
alter function public.assign_seats_atomic(uuid, integer, text, text)
  set search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────────────────
-- NOT fixed here, and why:
--
-- • "RLS Enabled No Policy" on living_table_interest and living_table_tickets
--   is the CORRECT, intended state for this app: RLS on + no policy means the
--   anon key gets zero rows, while the service-role API routes keep full
--   access. Adding public policies would WEAKEN security. Leave as-is.
--
-- • "Unused Index" (x3) is an informational performance hint, not a security
--   issue. The indexes are simply not used yet (low traffic / recently added).
--   Harmless; safe to leave. Do not drop without knowing the column — some
--   back constraints. No action taken.
-- ─────────────────────────────────────────────────────────────────────────
