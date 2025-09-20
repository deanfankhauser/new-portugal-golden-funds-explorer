-- SECURITY FIX: Implement proper access control for manager public views
-- This addresses the critical security issue of publicly exposed manager information

-- Step 1: Enable RLS on both public views
ALTER VIEW public.managers_public_view SET (security_invoker = true);
ALTER VIEW public.public_managers SET (security_invoker = true);

-- Step 2: Enable Row Level Security on the views (if not already enabled)
-- Note: Views inherit RLS from their underlying tables, but we can add explicit policies

-- Step 3: Create secure policies that require authentication for viewing manager data
-- This ensures anonymous users cannot access manager information

-- Policy for managers_public_view - requires authentication
DROP POLICY IF EXISTS "Authenticated users only can view managers public info" ON public.manager_profiles;
CREATE POLICY "Authenticated users only can view managers public info" 
ON public.manager_profiles 
FOR SELECT 
USING (
    status = 'approved' 
    AND auth.uid() IS NOT NULL  -- Requires authentication
    AND company_name IS NOT NULL 
    AND manager_name IS NOT NULL
);

-- Update the existing policy to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can view approved managers" ON public.manager_profiles;

-- Step 4: Create a truly public view with only non-sensitive information
-- This view will contain only absolutely safe, marketing-type information
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
    founded_year,
    -- Remove potentially sensitive information:
    -- No assets_under_management (business intelligence)
    -- No created_at (operational information)
    -- No internal IDs or user references
    'Marketing Directory' as source_note
FROM manager_profiles
WHERE status = 'approved'
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

-- Step 5: Set up the new directory view to be truly public (no auth required)
-- This is safe because it only contains marketing information
ALTER VIEW public.managers_directory SET (security_invoker = true);

-- Step 6: Grant appropriate permissions
GRANT SELECT ON public.managers_directory TO anon, authenticated;

-- Step 7: Update existing views to require authentication
-- Remove public access from the detailed views
REVOKE SELECT ON public.managers_public_view FROM anon;
REVOKE SELECT ON public.public_managers FROM anon;

-- Keep authenticated access for legitimate users
GRANT SELECT ON public.managers_public_view TO authenticated;
GRANT SELECT ON public.public_managers TO authenticated;

-- Step 8: Add security documentation
COMMENT ON VIEW public.managers_directory IS 
'PUBLIC DIRECTORY: Safe marketing information only. No contact details, assets, or sensitive data.';

COMMENT ON VIEW public.managers_public_view IS 
'AUTHENTICATED VIEW: Detailed manager information requiring user authentication. Contains business data.';

COMMENT ON VIEW public.public_managers IS 
'AUTHENTICATED VIEW: Manager information requiring user authentication. Contains business data.';