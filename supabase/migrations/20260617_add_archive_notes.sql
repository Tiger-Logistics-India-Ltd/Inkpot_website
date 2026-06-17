-- Run in Supabase SQL Editor

ALTER TABLE living_table_tickets
ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notes    text;
