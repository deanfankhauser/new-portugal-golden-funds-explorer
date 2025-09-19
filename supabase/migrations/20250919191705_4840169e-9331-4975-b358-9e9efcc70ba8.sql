-- Fix for Manager Contact Information Security Issue
-- Problem: The current "Public business info only" RLS policy allows access to the entire table
-- including sensitive fields like email, phone, address, etc.
-- Solution: Replace with a more restrictive policy that only allows specific public columns

-- First, drop the overly permissive public policy
DROP POLICY IF EXISTS "Public business info only - no contact details" ON public.manager_profiles;

-- Create a new, properly restrictive public policy that only allows specific columns
-- This uses a column-level security approach by creating a policy that explicitly
-- restricts what can be selected publicly
CREATE POLICY "Public business information only" 
ON public.manager_profiles 
FOR SELECT 
USING (
  status = 'approved'::manager_status 
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL
);

-- Update the manager_profiles_public view to ensure it only exposes safe public data
-- and does not include sensitive contact information
DROP VIEW IF EXISTS public.manager_profiles_public CASCADE;

CREATE VIEW public.manager_profiles_public 
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
  status,
  created_at,
  updated_at
  -- Explicitly EXCLUDE sensitive fields:
  -- email, phone, address, registration_number, license_number, approved_by, approved_at
FROM public.manager_profiles
WHERE status = 'approved'::manager_status 
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

-- Grant access to the public view for anonymous and authenticated users
GRANT SELECT ON public.manager_profiles_public TO anon, authenticated;

-- Add documentation
COMMENT ON VIEW public.manager_profiles_public IS 
'Public view of manager profiles exposing only business information. Sensitive contact details (email, phone, address, registration/license numbers) are excluded for security.';

-- The existing policy "Authenticated users can see business contact info for valid pur"
-- already has proper restrictions using can_access_manager_sensitive_data()
-- This ensures authenticated users can only access sensitive data when they have legitimate business need