-- Add youtube_url and tiktok_url columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS youtube_url text,
ADD COLUMN IF NOT EXISTS tiktok_url text;

-- Drop the existing view and recreate with new columns
DROP VIEW IF EXISTS public.public_company_profiles;

CREATE VIEW public.public_company_profiles AS
SELECT 
  id,
  user_id,
  company_name,
  manager_name,
  description,
  logo_url,
  website,
  city,
  country,
  founded_year,
  assets_under_management,
  registration_number,
  license_number,
  manager_about,
  manager_highlights,
  manager_faqs,
  team_members,
  linkedin_url,
  twitter_url,
  facebook_url,
  instagram_url,
  youtube_url,
  tiktok_url,
  entity_type,
  created_at,
  updated_at
FROM public.profiles
WHERE company_name IS NOT NULL 
  AND manager_name IS NOT NULL;