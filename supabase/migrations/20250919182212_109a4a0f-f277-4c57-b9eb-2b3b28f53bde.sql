-- Fix the security definer view issue by recreating without security barrier
DROP VIEW IF EXISTS public.manager_profiles_public;

-- Create a standard view for public manager information (no contact details)
CREATE VIEW public.manager_profiles_public AS
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

-- Grant access to the safe view without security definer
GRANT SELECT ON public.manager_profiles_public TO anon;
GRANT SELECT ON public.manager_profiles_public TO authenticated;