-- Remove the overly permissive policy that still allows sensitive data access
DROP POLICY IF EXISTS "Authenticated users can see business info" ON public.manager_profiles;