-- Add social media link columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT;

COMMENT ON COLUMN public.profiles.linkedin_url IS 'LinkedIn profile or company page URL';
COMMENT ON COLUMN public.profiles.twitter_url IS 'Twitter/X profile URL';
COMMENT ON COLUMN public.profiles.facebook_url IS 'Facebook page URL';
COMMENT ON COLUMN public.profiles.instagram_url IS 'Instagram profile URL';