-- First drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public can view approved manager basic info" ON public.manager_profiles;

-- Create a secure public view for manager profiles that only exposes safe information
CREATE OR REPLACE VIEW public.managers_public_view AS
SELECT 
  id,
  company_name,
  manager_name,
  description,
  founded_year,
  assets_under_management,
  website,
  city,
  country,
  logo_url,
  created_at
FROM public.manager_profiles
WHERE status = 'approved'::manager_status
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

-- Enable security barrier on the public view
ALTER VIEW public.managers_public_view SET (security_barrier = true);

-- Create a more secure policy that requires authentication and only shows approved managers
CREATE POLICY "Authenticated users can view approved managers" 
ON public.manager_profiles 
FOR SELECT 
USING (
  status = 'approved'::manager_status AND 
  auth.uid() IS NOT NULL
);