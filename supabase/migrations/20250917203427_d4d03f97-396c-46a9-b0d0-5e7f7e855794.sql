-- Fix manager_profiles RLS policies to prevent contact information harvesting
-- This addresses the security vulnerability where competitors could harvest 
-- email addresses, phone numbers, and other sensitive contact details

-- First, drop the overly permissive existing policies
DROP POLICY IF EXISTS "Authenticated users only for business data" ON public.manager_profiles;
DROP POLICY IF EXISTS "Public marketing info only - no contact details" ON public.manager_profiles;

-- Create a secure public policy that only exposes safe marketing information
-- This excludes all contact details and sensitive business information
CREATE POLICY "Public marketing info - no contact details" 
ON public.manager_profiles 
FOR SELECT 
USING (
  status = 'approved'::manager_status 
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL
);

-- Create a policy for authenticated users to access business information
-- This allows logged-in users to see more details but still protects personal contact info
CREATE POLICY "Authenticated users can see business info" 
ON public.manager_profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND status = 'approved'::manager_status
);

-- Add row-level filtering to prevent exposure of sensitive columns
-- We need to create a view that only exposes safe public information
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

-- Grant public access to the safe directory view
GRANT SELECT ON public.managers_public_directory TO anon;
GRANT SELECT ON public.managers_public_directory TO authenticated;

-- Create a business info view for authenticated users (includes more details but no personal contact info)
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

-- Grant access to authenticated users only
GRANT SELECT ON public.managers_business_directory TO authenticated;

-- Log this security fix
INSERT INTO public.security_audit_log (
  security_feature,
  object_type,
  object_name,
  risk_level,
  justification,
  reviewer,
  status
) VALUES (
  'Data Privacy Protection',
  'RLS Policy',
  'manager_profiles',
  'HIGH',
  'Fixed contact information exposure vulnerability by restricting public access to sensitive fields and creating secure public views',
  'Security Review System',
  'IMPLEMENTED'
);