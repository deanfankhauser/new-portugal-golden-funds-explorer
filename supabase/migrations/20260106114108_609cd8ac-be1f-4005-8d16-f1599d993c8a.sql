-- Add new fields to team_members table for extended profile data
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS languages text[],
ADD COLUMN IF NOT EXISTS team_since date,
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS certifications text[];