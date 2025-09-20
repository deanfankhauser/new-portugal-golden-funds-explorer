-- Security hardening: remove public SELECT access from manager_profiles and rely on safe public view
-- Context: Sensitive fields (email, phone, address, registration/license numbers) must not be publicly accessible.
-- The public should consume manager data via manager_profiles_public only.

begin;

-- 1) Drop any public-facing SELECT policy on the base table
DROP POLICY IF EXISTS "Public business information only" ON public.manager_profiles;

-- 2) Extra safety: ensure anon has no direct table privileges (RLS is primary control, this is defense-in-depth)
REVOKE SELECT ON public.manager_profiles FROM anon;

-- 3) Ensure documentation on the table clarifies access pattern
COMMENT ON TABLE public.manager_profiles IS 
  'Contains sensitive manager contact info. Public access is via manager_profiles_public view only. Do not add public SELECT policies.';

commit;