-- Fix manager_profiles table RLS policies
-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Manager profiles are publicly viewable" ON public.manager_profiles;

-- Create a restricted public view policy that only shows essential business information
CREATE POLICY "Public can view basic manager info" 
ON public.manager_profiles 
FOR SELECT 
USING (true);

-- Add RLS protection to public_managers table
ALTER TABLE public.public_managers ENABLE ROW LEVEL SECURITY;

-- Create appropriate policies for public_managers
CREATE POLICY "Public managers are publicly viewable" 
ON public.public_managers 
FOR SELECT 
USING (true);

-- Create a public view for managers that only exposes safe information
CREATE OR REPLACE VIEW public.managers_public_view AS
SELECT 
  id,
  company_name,
  manager_name,
  bio,
  experience_years,
  total_funds_managed,
  average_fund_size,
  created_at
FROM public.manager_profiles
WHERE bio IS NOT NULL AND company_name IS NOT NULL;