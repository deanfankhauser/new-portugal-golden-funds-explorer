-- Insert all the missing static funds into the database
-- First let's clear any existing test data and insert all 29 funds

-- Get a count of existing funds
DO $$
DECLARE
    existing_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO existing_count FROM public.funds;
    RAISE NOTICE 'Current fund count: %', existing_count;
END $$;

-- Insert all funds from static data (we'll need to do this via the application)
-- For now, let's ensure the table structure can handle all the fund data

-- Check the current funds in the database
SELECT id, name, created_at FROM public.funds ORDER BY name;