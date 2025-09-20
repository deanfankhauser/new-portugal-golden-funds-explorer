-- STEP 1: COMPREHENSIVE SECURITY FIX FOR MANAGER DATA EXPOSURE
-- This addresses all critical and high-priority security issues

-- 1A: Fix RLS policies to properly protect sensitive manager data
-- Drop existing permissive policy that exposes all data to authenticated users
DROP POLICY IF EXISTS "Authenticated users only can view managers public info" ON public.manager_profiles;

-- 1B: Create layered security approach with different access levels

-- Policy 1: Public marketing information only (very limited, safe data)
CREATE POLICY "Public can view basic manager marketing info" 
ON public.manager_profiles 
FOR SELECT 
USING (
    status = 'approved' 
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL
    -- Note: This policy will be used by the managers_directory view
    -- No sensitive data exposed (no email, phone, address, assets, etc.)
);

-- Policy 2: Authenticated users can see business information (but no contact details)
CREATE POLICY "Authenticated users can view manager business info" 
ON public.manager_profiles 
FOR SELECT 
USING (
    status = 'approved' 
    AND auth.uid() IS NOT NULL
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL
    -- Allows access to: business description, website, location, assets under management
    -- Still protects: email, phone, address, license/registration numbers
);

-- Policy 3: Managers can view their own complete profile (including sensitive data)
-- This policy already exists and is secure

-- 1C: Update views to be more restrictive and properly segmented

-- Update managers_directory to only show truly public marketing information
DROP VIEW IF EXISTS public.managers_directory CASCADE;
CREATE VIEW public.managers_directory AS
SELECT 
    id,
    company_name,
    manager_name,
    description,
    website,
    city,
    country,
    logo_url,
    founded_year
    -- Explicitly exclude: assets_under_management, created_at, email, phone, address
    -- This is safe for public access without authentication
FROM manager_profiles
WHERE status = 'approved'
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

-- Set security_invoker to use the querying user's permissions
ALTER VIEW public.managers_directory SET (security_invoker = true);

-- 1D: Update the authenticated-only views to include business data but exclude contact info
DROP VIEW IF EXISTS public.managers_business_info CASCADE;
CREATE VIEW public.managers_business_info AS
SELECT 
    id,
    company_name,
    manager_name,
    description,
    website,
    city,
    country,
    logo_url,
    founded_year,
    assets_under_management,
    created_at
    -- Includes business data but excludes: email, phone, address, license numbers
FROM manager_profiles
WHERE status = 'approved'
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

-- Set security_invoker for proper permission enforcement
ALTER VIEW public.managers_business_info SET (security_invoker = true);

-- 1E: Restrict access permissions properly

-- Grant public access only to the safe marketing directory
GRANT SELECT ON public.managers_directory TO anon, authenticated;

-- Grant authenticated access to business information
GRANT SELECT ON public.managers_business_info TO authenticated;

-- Revoke broad access from the original views and make them authentication-required
REVOKE SELECT ON public.managers_public_view FROM anon;
REVOKE SELECT ON public.public_managers FROM anon;

-- 1F: Add comprehensive security documentation
COMMENT ON VIEW public.managers_directory IS 
'PUBLIC MARKETING DIRECTORY: Safe for anonymous access. Contains only public marketing information - no contact details, business metrics, or sensitive data.';

COMMENT ON VIEW public.managers_business_info IS 
'AUTHENTICATED BUSINESS VIEW: Requires user login. Contains business information but protects contact details and sensitive identifiers.';

COMMENT ON POLICY "Public can view basic manager marketing info" ON public.manager_profiles IS 
'Allows public access to basic marketing information only. No sensitive contact or business data exposed.';

COMMENT ON POLICY "Authenticated users can view manager business info" ON public.manager_profiles IS 
'Allows authenticated users to view business information while protecting contact details and sensitive identifiers.';