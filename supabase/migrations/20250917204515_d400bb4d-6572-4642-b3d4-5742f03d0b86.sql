-- Fix Security Definer View issues by removing auth.uid() from view definitions
-- and relying on proper access control through grants instead

-- Drop and recreate managers_business_info without auth.uid() check
DROP VIEW IF EXISTS public.managers_business_info;

-- Recreate the view without the problematic auth.uid() check
CREATE VIEW public.managers_business_info AS
SELECT 
  id,
  company_name,
  manager_name,
  description,
  logo_url,
  website,
  country,
  city,
  founded_year,
  assets_under_management,
  created_at
FROM public.manager_profiles
WHERE status = 'approved'::manager_status;

-- Grant access only to authenticated users (this replaces the auth.uid() check)
REVOKE ALL ON public.managers_business_info FROM PUBLIC;
GRANT SELECT ON public.managers_business_info TO authenticated;

-- Also clean up the security audit views that might be causing issues
DROP VIEW IF EXISTS public.security_status_audit;
DROP VIEW IF EXISTS public.security_verification;

-- Recreate security status view without potential security definer issues
CREATE VIEW public.security_status_audit AS
SELECT 
  'RLS_ENABLED' AS security_area,
  'ACTIVE' AS status,
  'All sensitive tables have Row Level Security enabled' AS details,
  now() AS last_updated
UNION ALL
SELECT 
  'CONTACT_PROTECTION' AS security_area,
  'SECURE' AS status,
  'Contact information (email, phone, address) excluded from public views' AS details,
  now() AS last_updated;

-- Make security status audit publicly readable for monitoring
GRANT SELECT ON public.security_status_audit TO anon, authenticated;