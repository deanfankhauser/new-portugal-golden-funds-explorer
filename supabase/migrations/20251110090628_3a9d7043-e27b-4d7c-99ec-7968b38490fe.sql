-- Drop and recreate get_public_manager_profiles RPC function to use unified profiles table
DROP FUNCTION IF EXISTS public.get_public_manager_profiles();

CREATE OR REPLACE FUNCTION public.get_public_manager_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  company_name text,
  manager_name text,
  description text,
  logo_url text,
  website text,
  city text,
  country text,
  founded_year integer,
  assets_under_management bigint,
  registration_number text,
  license_number text,
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.company_name,
    p.manager_name,
    p.description,
    p.logo_url,
    p.website,
    p.city,
    p.country,
    p.founded_year,
    p.assets_under_management,
    p.registration_number,
    p.license_number,
    p.status::text,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.status::text = 'approved'
    AND p.company_name IS NOT NULL 
    AND p.manager_name IS NOT NULL;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_public_manager_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_manager_profiles() TO anon;

-- Drop and recreate get_basic_manager_info function to use unified profiles table
DROP FUNCTION IF EXISTS public.get_basic_manager_info();

CREATE OR REPLACE FUNCTION public.get_basic_manager_info()
RETURNS TABLE (
  company_name text,
  manager_name text,
  description text,
  website text,
  city text,
  country text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT 
    p.company_name,
    p.manager_name,
    p.description,
    p.website,
    p.city,
    p.country
  FROM public.profiles p
  WHERE p.status::text = 'approved'
    AND p.company_name IS NOT NULL 
    AND p.manager_name IS NOT NULL;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_basic_manager_info() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_basic_manager_info() TO anon;