-- Run in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--
-- Adds an `edition` discriminator to living_table_tickets so one table can
-- serve multiple editions of The Living Table. Existing rows are the inaugural
-- edition and are backfilled to 'june-2026'.
--
-- Safe to run more than once.

ALTER TABLE living_table_tickets
  ADD COLUMN IF NOT EXISTS edition text;

UPDATE living_table_tickets
  SET edition = 'june-2026'
  WHERE edition IS NULL;

ALTER TABLE living_table_tickets
  ALTER COLUMN edition SET DEFAULT 'june-2026',
  ALTER COLUMN edition SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_lt_tickets_edition
  ON living_table_tickets (edition);

-- Note: the living_table_stats view is NOT edition-aware. The admin dashboard
-- still reads it for a combined figure; per-edition counts come from the
-- edition-scoped queries in the ticket routes. A follow-up can add an
-- edition-grouped view if the dashboard needs per-edition stats.
