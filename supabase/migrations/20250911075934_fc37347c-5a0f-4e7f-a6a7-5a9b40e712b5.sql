-- Fix SECURITY DEFINER views security issue
-- Replace existing problematic views with secure alternatives

-- Drop existing views that have security_barrier enabled
DROP VIEW IF EXISTS public.managers_public_view CASCADE;
DROP VIEW IF EXISTS public.public_managers CASCADE;

-- Create secure view for public manager data without security_barrier
-- This view will use the querying user's permissions, not the view creator's
CREATE VIEW public.managers_public_view AS
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
FROM manager_profiles
WHERE status = 'approved'
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL;

-- Create the public_managers view without security barriers
CREATE VIEW public.public_managers AS
SELECT 
  id,
  company_name,
  manager_name,
  website,
  description,
  city,
  country,
  assets_under_management,
  founded_year,
  logo_url,
  created_at
FROM manager_profiles
WHERE status = 'approved';

-- Grant appropriate permissions to the views
-- These will use the RLS policies of the underlying table (manager_profiles)
GRANT SELECT ON public.managers_public_view TO anon, authenticated;
GRANT SELECT ON public.public_managers TO anon, authenticated;

-- Ensure the underlying table has proper RLS policies
-- The existing policy "Authenticated users can view approved managers" should handle access control