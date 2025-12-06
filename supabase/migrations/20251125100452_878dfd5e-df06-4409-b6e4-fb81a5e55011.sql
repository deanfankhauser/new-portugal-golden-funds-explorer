-- Normalize team member slugs to ASCII-only characters for SEO and URL compatibility
-- This fixes SSG build errors where URL-encoded slugs in sitemaps don't match file paths

-- Function to normalize slugs by removing accents and converting to ASCII
CREATE OR REPLACE FUNCTION normalize_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      translate(
        input_text,
        'áàãâäåéèêëíìîïóòõôöúùûüñçÁÀÃÂÄÅÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÑÇ',
        'aaaaaaeeeeiiiioooooouuuuncAAAAAEEEEIIIIOOOOOUUUUNC'
      ),
      '[^a-z0-9]+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update all team member slugs with non-ASCII characters
UPDATE team_members
SET slug = normalize_slug(name)
WHERE slug ~ '[^a-z0-9-]';

-- Verify the changes (this will show in the logs)
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM team_members
  WHERE slug ~ '[^a-z0-9-]';
  
  RAISE NOTICE 'Team member slugs normalized. Remaining non-ASCII slugs: %', updated_count;
END $$;