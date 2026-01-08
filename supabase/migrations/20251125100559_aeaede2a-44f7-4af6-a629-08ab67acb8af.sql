-- Fix team member slugs that were incorrectly normalized
-- Use unaccent extension for proper accent removal

-- Enable unaccent extension if not already enabled
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create improved normalize function using unaccent
CREATE OR REPLACE FUNCTION normalize_slug_fixed(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(input_text),
        '[^a-z0-9]+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'  -- Remove leading/trailing hyphens
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update all team member slugs using the fixed function
UPDATE team_members
SET slug = normalize_slug_fixed(name);

-- Verify the changes
DO $$
DECLARE
  sample_slugs TEXT;
BEGIN
  SELECT string_agg(name || ' → ' || slug, E'\n' ORDER BY name) INTO sample_slugs
  FROM team_members
  LIMIT 10;
  
  RAISE NOTICE E'Sample normalized slugs:\n%', sample_slugs;
END $$;