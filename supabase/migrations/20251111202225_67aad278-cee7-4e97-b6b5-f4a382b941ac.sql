-- Add team_members column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS team_members jsonb DEFAULT NULL;

COMMENT ON COLUMN public.profiles.team_members IS 'Array of team member objects with name, position, bio, photoUrl, linkedinUrl, email';