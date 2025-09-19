-- Fix for Supabase Linter 0010: Security Definer View
-- Make the public view run with SECURITY INVOKER so it enforces the caller's RLS
-- and ensure appropriate grants for read-only access.

-- Safety: only apply if the view exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_views 
    WHERE schemaname = 'public' AND viewname = 'manager_profiles_public'
  ) THEN
    -- Enforce SECURITY INVOKER to prevent privilege escalation through the view
    EXECUTE 'ALTER VIEW public.manager_profiles_public SET (security_invoker = true)';

    -- Optional but recommended: document the reason for this setting
    EXECUTE $$COMMENT ON VIEW public.manager_profiles_public IS 'Security hardened: SECURITY INVOKER enabled to ensure caller RLS is applied (fix for linter rule 0010).';$$;

    -- Ensure typical Supabase roles can read the public business info via the view
    -- (Underlying table RLS still applies because of SECURITY INVOKER)
    EXECUTE 'GRANT SELECT ON public.manager_profiles_public TO anon, authenticated';
  END IF;
END $$;

-- Verification helper (no schema changes): shows current invoker setting after migration
-- SELECT relname AS view_name, reloptions FROM pg_class c
-- JOIN pg_namespace n ON n.oid = c.relnamespace
-- WHERE n.nspname = 'public' AND relkind = 'v' AND relname = 'manager_profiles_public';
