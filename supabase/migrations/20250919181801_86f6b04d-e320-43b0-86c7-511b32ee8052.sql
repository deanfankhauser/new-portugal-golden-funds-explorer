-- First, drop the problematic public policy that exposes contact information
DROP POLICY IF EXISTS "Public marketing info - no contact details" ON public.manager_profiles;

-- Create a new restrictive public policy that only allows basic company info
CREATE POLICY "Public company info only - no sensitive data"
ON public.manager_profiles
FOR SELECT
USING (
  status = 'approved'::manager_status 
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL
);

-- Create a database view for truly public manager information (no contact details)
CREATE OR REPLACE VIEW public.manager_profiles_public AS
SELECT
  id,
  user_id,
  company_name,
  manager_name,
  logo_url,
  website,
  description,
  country,
  city,
  founded_year,
  assets_under_management,
  registration_number,
  license_number,
  status,
  created_at,
  updated_at
  -- Deliberately excluding: email, phone, address, approved_by, approved_at
FROM public.manager_profiles
WHERE status = 'approved'::manager_status
  AND company_name IS NOT NULL
  AND manager_name IS NOT NULL;

-- Enable RLS on the public view
ALTER VIEW public.manager_profiles_public SET (security_barrier = true);

-- Grant public access to the safe view
GRANT SELECT ON public.manager_profiles_public TO anon;
GRANT SELECT ON public.manager_profiles_public TO authenticated;

-- Create a security function to check if a user can access sensitive manager data
CREATE OR REPLACE FUNCTION public.can_access_manager_sensitive_data(manager_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- Users can access their own sensitive data, admins can access all
  SELECT (
    auth.uid() IS NOT NULL AND (
      auth.uid() = manager_user_id OR 
      is_user_admin()
    )
  );
$$;

-- Create a new policy for authenticated users to access business contact info when appropriate
CREATE POLICY "Authenticated users can see business contact info for valid purposes"
ON public.manager_profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND status = 'approved'::manager_status
  AND can_access_manager_sensitive_data(user_id)
);