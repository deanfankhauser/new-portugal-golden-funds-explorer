-- Drop the insecure public view that bypasses RLS
DROP VIEW IF EXISTS public.manager_profiles_public;

-- Create a security definer function that provides controlled public access
-- This allows us to implement proper access control while maintaining functionality
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
  status manager_status,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only return basic business information for approved managers
  -- Sensitive data like email, phone, address is excluded
  SELECT 
    mp.id,
    mp.user_id,
    mp.company_name,
    mp.manager_name,
    mp.description,
    mp.logo_url,
    mp.website,
    mp.city,
    mp.country,
    mp.founded_year,
    mp.assets_under_management,
    mp.status,
    mp.created_at,
    mp.updated_at
  FROM public.manager_profiles mp
  WHERE mp.status = 'approved'::manager_status 
    AND mp.company_name IS NOT NULL 
    AND mp.manager_name IS NOT NULL;
$$;

-- Grant execute permission to authenticated users only
-- This ensures that even "public" manager profiles require authentication
GRANT EXECUTE ON FUNCTION public.get_public_manager_profiles() TO authenticated;

-- Optionally, if you need some basic info to be truly public (like for SEO),
-- create a separate function with more restricted data
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
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only the most basic business information for public consumption
  SELECT 
    mp.company_name,
    mp.manager_name,
    mp.description,
    mp.website,
    mp.city,
    mp.country
  FROM public.manager_profiles mp
  WHERE mp.status = 'approved'::manager_status 
    AND mp.company_name IS NOT NULL 
    AND mp.manager_name IS NOT NULL;
$$;

-- This function can be accessed by anyone for basic business directory purposes
GRANT EXECUTE ON FUNCTION public.get_basic_manager_info() TO anon, authenticated;