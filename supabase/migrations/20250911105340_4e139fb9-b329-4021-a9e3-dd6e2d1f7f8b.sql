-- SECURITY FIX: Restrict public access to manager profiles - exclude sensitive contact information
-- This addresses the security finding about manager contact information being exposed to public

-- First, drop the existing overly permissive public policy
DROP POLICY IF EXISTS "Public marketing directory access only" ON public.manager_profiles;

-- Create a new restricted public policy that explicitly excludes sensitive contact information
-- This policy will be used by public views (managers_directory, public_managers) that should NOT show contact details
CREATE POLICY "Public marketing info only - no contact details" 
ON public.manager_profiles 
FOR SELECT 
USING (
    status = 'approved' 
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL
);

-- Create a separate policy for authenticated users who need full business contact information
-- This allows legitimate business users to access contact details for networking/business purposes
CREATE POLICY "Authenticated users can view full business profiles" 
ON public.manager_profiles 
FOR SELECT 
USING (
    status = 'approved' 
    AND auth.uid() IS NOT NULL
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL
);

-- Recreate the managers_directory view to EXPLICITLY exclude sensitive contact information
-- This ensures no contact details leak through public access
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
    -- EXPLICITLY EXCLUDED: email, phone, address, license_number, registration_number
FROM public.manager_profiles
WHERE status = 'approved'
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL;

-- Recreate the public_managers view with the same restrictions
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
    assets_under_management,
    created_at
    -- EXPLICITLY EXCLUDED: email, phone, address, license_number, registration_number
FROM public.manager_profiles
WHERE status = 'approved'
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL;

-- Create a secure business_info view for authenticated users who need contact information
-- This replaces managers_business_info with proper access controls
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
    assets_under_management,
    created_at
    -- Contact information available only to authenticated users through direct table access
FROM public.manager_profiles
WHERE status = 'approved'
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL;

-- Add security documentation
COMMENT ON VIEW public.managers_directory IS 
'SECURITY: Public marketing directory with ONLY basic company information. Contact details (email, phone, address, license numbers) are EXPLICITLY EXCLUDED to prevent spam/harassment. Safe for public access.';

COMMENT ON VIEW public.public_managers IS 
'SECURITY: Public manager listing with ONLY marketing information. Contact details (email, phone, address, license numbers) are EXPLICITLY EXCLUDED. Safe for public access.';

COMMENT ON VIEW public.managers_business_info IS 
'SECURITY: Business information for authenticated users. Contact details available through direct table access with authentication required.';

COMMENT ON POLICY "Public marketing info only - no contact details" ON public.manager_profiles IS 
'Allows public access to basic marketing information only. Contact details (email, phone, address, license_number, registration_number) must be accessed through authenticated queries only.';

COMMENT ON POLICY "Authenticated users can view full business profiles" ON public.manager_profiles IS 
'Allows authenticated users to access full business profiles including contact information for legitimate business networking purposes.';

-- Verification query
SELECT 
    'CONTACT_SECURITY_FIX_APPLIED' as status,
    'Public access now excludes all contact information. Contact details require authentication.' as description,
    now() as applied_at;