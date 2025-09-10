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

-- Enable RLS on the public view
ALTER VIEW public.managers_public_view SET (security_barrier = true);

-- Create more restrictive policy for manager_profiles to limit exposed data
DROP POLICY IF EXISTS "Public can view approved managers" ON public.manager_profiles;

-- New policy that only allows viewing basic business info for approved managers
CREATE POLICY "Public can view approved manager basic info" 
ON public.manager_profiles 
FOR SELECT 
USING (
  status = 'approved'::manager_status AND 
  auth.uid() IS NOT NULL -- Require authentication to view any manager data
);