-- Fix security definer view issues detected by the linter
-- Replace the views without SECURITY DEFINER to avoid privilege escalation

-- Drop the existing views
DROP VIEW IF EXISTS public.managers_public_directory;
DROP VIEW IF EXISTS public.managers_business_directory;

-- Recreate views without SECURITY DEFINER (using default INVOKER rights)
CREATE VIEW public.managers_public_directory AS
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

CREATE VIEW public.managers_business_directory AS
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

-- Grant appropriate permissions
GRANT SELECT ON public.managers_public_directory TO anon;
GRANT SELECT ON public.managers_public_directory TO authenticated;
GRANT SELECT ON public.managers_business_directory TO authenticated;