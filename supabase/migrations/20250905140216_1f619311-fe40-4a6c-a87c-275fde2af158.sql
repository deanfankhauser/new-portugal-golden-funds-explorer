-- Drop the problematic view and recreate it without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_managers;

-- Create view for public manager data (what users can see) without SECURITY DEFINER
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
FROM public.manager_profiles
WHERE status = 'approved';

-- Grant permissions on the view
GRANT SELECT ON public.public_managers TO anon, authenticated;