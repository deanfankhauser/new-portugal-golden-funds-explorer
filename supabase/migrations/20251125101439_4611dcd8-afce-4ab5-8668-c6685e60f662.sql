-- Regenerate ALL team member slugs with proper slug generation logic
-- This fixes corrupted slugs by applying comprehensive normalization

UPDATE team_members 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(name, 
        'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÝýÿÑñÇç',
        'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOOooooooUUUUuuuuYyyNnCc'
      ),
      '[^a-zA-Z0-9\s-]', '', 'g'  -- Remove non-alphanumeric except spaces and hyphens
    ),
    '\s+', '-', 'g'  -- Replace spaces with hyphens
  )
),
updated_at = now();

-- Add comment explaining the fix
COMMENT ON COLUMN team_members.slug IS 'URL-safe slug generated from name (ASCII-only, lowercase, hyphenated)';