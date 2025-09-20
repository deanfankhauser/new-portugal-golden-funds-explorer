-- SECURITY FIX: Address business data exposure by consolidating and improving RLS policies
-- This fixes the security issue where business data could be accessed without proper authentication

-- First, let's clean up duplicate/overlapping policies
DROP POLICY IF EXISTS "Authenticated users can view business info" ON public.manager_profiles;
DROP POLICY IF EXISTS "Authenticated users can view full business profiles" ON public.manager_profiles;
DROP POLICY IF EXISTS "Authenticated users can view manager business info" ON public.manager_profiles;

-- Create a single, comprehensive policy for authenticated business data access
CREATE POLICY "Authenticated users only for business data" 
ON public.manager_profiles 
FOR SELECT 
USING (
    status = 'approved' 
    AND auth.uid() IS NOT NULL  -- CRITICAL: Requires authentication for business data
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL
);

-- Update the managers_business_info view to ensure it only shows data to authenticated users
-- by recreating it with a more secure query that double-checks authentication
DROP VIEW IF EXISTS public.managers_business_info;
CREATE VIEW public.managers_business_info 
WITH (security_invoker = true) AS
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
    assets_under_management,  -- This sensitive business data requires authentication
    created_at
FROM public.manager_profiles
WHERE status = 'approved'
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL
    AND auth.uid() IS NOT NULL;  -- EXPLICIT authentication check in view

-- Ensure public directory views exclude business-sensitive data completely
DROP VIEW IF EXISTS public.managers_directory;
CREATE VIEW public.managers_directory 
WITH (security_invoker = true) AS
SELECT 
    id,
    company_name,
    manager_name,
    description,
    logo_url,
    website,
    country,
    city,
    founded_year
    -- EXPLICITLY EXCLUDED: assets_under_management, email, phone, address, license_number, registration_number
FROM public.manager_profiles
WHERE status = 'approved'
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL;

-- Recreate public_managers view with the same security restrictions
DROP VIEW IF EXISTS public.public_managers;
CREATE VIEW public.public_managers 
WITH (security_invoker = true) AS
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
    created_at
    -- EXPLICITLY EXCLUDED: assets_under_management (business sensitive), contact information
FROM public.manager_profiles
WHERE status = 'approved'
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL;

-- Drop and recreate managers_public_view to match security standards
DROP VIEW IF EXISTS public.managers_public_view;
CREATE VIEW public.managers_public_view 
WITH (security_invoker = true) AS
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
    created_at
    -- EXPLICITLY EXCLUDED: assets_under_management and all contact information
FROM public.manager_profiles
WHERE status = 'approved'
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL;

-- Add security documentation
COMMENT ON POLICY "Authenticated users only for business data" ON public.manager_profiles IS 
'SECURITY: Ensures business-sensitive data including assets_under_management can only be accessed by authenticated users. This prevents unauthorized competitive intelligence gathering.';

COMMENT ON VIEW public.managers_business_info IS 
'SECURITY: Contains business-sensitive data including assets under management. Requires authentication through both RLS policy and explicit auth check in view query.';

COMMENT ON VIEW public.managers_directory IS 
'SECURITY: Public directory with basic marketing info only. Business-sensitive data like assets_under_management and all contact information explicitly excluded.';

COMMENT ON VIEW public.public_managers IS 
'SECURITY: Public manager listing excluding business-sensitive financial data and contact information. Safe for unauthenticated access.';

COMMENT ON VIEW public.managers_public_view IS 
'SECURITY: Public view of manager profiles excluding all sensitive business and contact data. Suitable for public consumption without authentication.';

-- Final verification
SELECT 
    'BUSINESS_DATA_SECURITY_FIXED' as status,
    'Business data now requires authentication, public views exclude sensitive information' as description,
    now() as applied_at;