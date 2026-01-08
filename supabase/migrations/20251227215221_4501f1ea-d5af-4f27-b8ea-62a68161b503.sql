-- Add LinkedIn URL column to funds table
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS linkedin_url text;