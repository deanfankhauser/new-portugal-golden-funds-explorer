-- Fix manager_profiles RLS policies to prevent contact information harvesting
-- Drop existing public access policies that expose sensitive data
DROP POLICY IF EXISTS "Public marketing info only - no contact details" ON public.manager_profiles;
DROP POLICY IF EXISTS "Authenticated users only for business data" ON public.manager_profiles;

-- Create secure views that only expose safe marketing information
CREATE OR REPLACE VIEW public.managers_public_directory AS
SELECT 
  id,
  company_name,
  manager_name,
  description,
  website,
  country,
  city,
  founded_year,
  logo_url,
  created_at
FROM public.manager_profiles
WHERE status = 'approved'::manager_status
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

-- Create business info view for authenticated users (no personal contact details)
CREATE OR REPLACE VIEW public.managers_business_directory AS
SELECT 
  id,
  company_name,
  manager_name,
  description,
  website,
  country,
  city,
  founded_year,
  assets_under_management,
  logo_url,
  created_at
FROM public.manager_profiles
WHERE status = 'approved'::manager_status;

-- Grant appropriate access to views
GRANT SELECT ON public.managers_public_directory TO anon, authenticated;
GRANT SELECT ON public.managers_business_directory TO authenticated;