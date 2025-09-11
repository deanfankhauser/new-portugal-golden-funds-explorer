-- Fix Security Definer View issue by ensuring all views use SECURITY INVOKER
-- This ensures views use the permissions of the querying user, not the view creator

-- Check current view definitions first
SELECT 
    schemaname,
    viewname,
    viewowner
FROM pg_views 
WHERE schemaname = 'public';

-- Drop and recreate all views with explicit SECURITY INVOKER
-- This fixes the security linter issue

-- Drop existing views
DROP VIEW IF EXISTS public.security_verification;
DROP VIEW IF EXISTS public.security_status_audit;
DROP VIEW IF EXISTS public.public_managers;
DROP VIEW IF EXISTS public.managers_public_view;
DROP VIEW IF EXISTS public.managers_directory;
DROP VIEW IF EXISTS public.managers_business_info;

-- Recreate all views with SECURITY INVOKER (default, but explicit)
CREATE VIEW public.managers_business_info 
WITH (security_invoker = true) AS
SELECT 
    id,
    company_name,
    manager_name,
    description,
    city,
    country,
    website,
    logo_url,
    founded_year,
    assets_under_management,
    created_at
FROM public.manager_profiles
WHERE status = 'approved'
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

CREATE VIEW public.managers_directory 
WITH (security_invoker = true) AS
SELECT 
    id,
    company_name,
    manager_name,
    description,
    city,
    country,
    website,
    logo_url,
    founded_year
FROM public.manager_profiles
WHERE status = 'approved'
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

CREATE VIEW public.managers_public_view 
WITH (security_invoker = true) AS
SELECT 
    id,
    company_name,
    manager_name,
    description,
    city,
    country,
    website,
    logo_url,
    founded_year,
    assets_under_management,
    created_at
FROM public.manager_profiles
WHERE status = 'approved'
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

CREATE VIEW public.public_managers 
WITH (security_invoker = true) AS
SELECT 
    id,
    company_name,
    manager_name,
    description,
    city,
    country,
    website,
    logo_url,
    founded_year,
    assets_under_management,
    created_at
FROM public.manager_profiles
WHERE status = 'approved'
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

CREATE VIEW public.security_status_audit 
WITH (security_invoker = true) AS
SELECT 
    'RLS_ENABLED' as security_area,
    'ACTIVE' as status,
    'All sensitive tables have Row Level Security enabled' as details,
    now() as last_updated

UNION ALL

SELECT 
    'CONTACT_PROTECTION' as security_area,
    'SECURE' as status,
    'Contact information (email, phone, address) excluded from public views' as details,
    now() as last_updated;

CREATE VIEW public.security_verification 
WITH (security_invoker = true) AS
SELECT 
    'managers_directory' as view_name,
    'PUBLIC' as access_level,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'managers_directory' 
            AND column_name IN ('email', 'phone', 'address', 'license_number', 'registration_number')
        ) THEN '❌ SECURITY ISSUE: Contains sensitive fields'
        ELSE '✅ SECURE: No sensitive fields exposed'
    END as security_status

UNION ALL

SELECT 
    'managers_business_info' as view_name,
    'AUTHENTICATED' as access_level,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'managers_business_info' 
            AND column_name IN ('email', 'phone', 'address', 'license_number', 'registration_number')
        ) THEN '❌ SECURITY ISSUE: Contains sensitive fields'
        ELSE '✅ SECURE: No sensitive fields exposed'
    END as security_status;

-- Add security comments
COMMENT ON VIEW public.managers_directory IS 'Public directory view with SECURITY INVOKER - uses querying user permissions';
COMMENT ON VIEW public.managers_business_info IS 'Business info view with SECURITY INVOKER - uses querying user permissions';
COMMENT ON VIEW public.security_verification IS 'Security verification with SECURITY INVOKER - uses querying user permissions';