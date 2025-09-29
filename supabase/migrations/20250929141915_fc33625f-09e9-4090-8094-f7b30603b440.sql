-- Add hurdle_rate column to funds table
ALTER TABLE public.funds 
ADD COLUMN IF NOT EXISTS hurdle_rate numeric;