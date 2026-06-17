-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Adds the terms_accepted_at column to living_table_tickets.
-- Existing rows will have NULL (they predate the T&C gate).

ALTER TABLE living_table_tickets
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
