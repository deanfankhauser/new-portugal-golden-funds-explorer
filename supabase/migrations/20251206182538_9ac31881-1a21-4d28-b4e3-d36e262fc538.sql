-- =============================================================
-- SECURITY FIX: Restrict access to sensitive user data
-- =============================================================

-- -------------------------------------------------------------
-- FIX 1: email_captures table
-- The current "Allow select by confirmation token" policy is 
-- dangerously permissive - it allows anyone to read ALL rows
-- since most rows have a confirmation_token (IS NOT NULL)
-- -------------------------------------------------------------

DROP POLICY IF EXISTS "Allow select by confirmation token" ON public.email_captures;

-- No replacement needed - admin access policy already exists
-- The UPDATE policy still allows confirmation token verification flows

-- -------------------------------------------------------------
-- FIX 2: profiles table  
-- The "Public read access to company profiles" policy exposes
-- sensitive columns (email, phone, DOB, income, net worth) to
-- anyone for any row where company_name IS NOT NULL
-- -------------------------------------------------------------

-- Create a secure view that excludes sensitive personal data
-- This view only includes columns safe for public display
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

-- Grant public access to the safe view (views bypass RLS by default)
GRANT SELECT ON public.public_company_profiles TO anon, authenticated;

-- Remove the dangerous direct table access policy that exposes all columns
DROP POLICY IF EXISTS "Public read access to company profiles" ON public.profiles;

-- Add a more restrictive policy: only authenticated users can access company profiles
-- Unauthenticated users must use the public_company_profiles view instead
CREATE POLICY "Authenticated users can view company profiles" 
ON public.profiles 
FOR SELECT 
USING (
  company_name IS NOT NULL AND auth.uid() IS NOT NULL
);