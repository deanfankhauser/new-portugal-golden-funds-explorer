-- Fix the view to explicitly use SECURITY INVOKER (caller's permissions, not definer's)
DROP VIEW IF EXISTS public.public_company_profiles;

CREATE VIEW public.public_company_profiles 
WITH (security_invoker = true) AS
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
  linkedin_url,
  twitter_url,
  facebook_url,
  instagram_url,
  manager_about,
  manager_highlights,
  manager_faqs,
  team_members,
  entity_type,
  created_at,
  updated_at
FROM public.profiles
WHERE company_name IS NOT NULL;

-- Grant public access to the safe view
GRANT SELECT ON public.public_company_profiles TO anon, authenticated;