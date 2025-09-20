-- Fix Security Definer View issue by removing SECURITY DEFINER from functions that don't need it
-- Handle dependencies properly

-- 1. Drop and recreate sync_database_functions_to_develop without SECURITY DEFINER
DROP FUNCTION IF EXISTS public.sync_database_functions_to_develop();
CREATE OR REPLACE FUNCTION public.sync_database_functions_to_develop()
RETURNS TABLE(function_name text, function_definition text, status text)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    r.routine_name::text as function_name,
    pg_get_functiondef(p.oid)::text as function_definition,
    'ready_for_migration'::text as status
  FROM information_schema.routines r
  JOIN information_schema.parameters par ON r.specific_name = par.specific_name
  JOIN pg_proc p ON p.proname = r.routine_name
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE r.routine_schema = 'public'
    AND r.routine_type = 'FUNCTION'
    AND n.nspname = 'public'
    AND r.routine_name NOT LIKE 'pg_%'
    AND r.routine_name NOT LIKE 'supabase_%'
  GROUP BY r.routine_name, p.oid
  ORDER BY r.routine_name;
END;
$function$;

-- 2. Handle update_funds_updated_at function and its trigger dependency
-- First drop the trigger, then recreate function without SECURITY DEFINER, then recreate trigger
DROP TRIGGER IF EXISTS update_funds_updated_at ON public.funds;

-- Recreate the function without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_funds_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER update_funds_updated_at
  BEFORE UPDATE ON public.funds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_funds_updated_at();

-- 3. Remove SECURITY DEFINER from validate_historical_performance
CREATE OR REPLACE FUNCTION public.validate_historical_performance(performance_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if performance_data is null or empty
  IF performance_data IS NULL OR performance_data = '{}'::jsonb THEN
    RETURN true; -- Allow null/empty data
  END IF;
  
  -- Validate that performance_data has expected structure
  -- Expected format: {"2023": {"returns": 8.5, "nav": 1.085}, "2024": {"returns": 12.3, "nav": 1.123}}
  IF jsonb_typeof(performance_data) = 'object' THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$function$;

-- Summary: The remaining functions with SECURITY DEFINER are legitimate security functions that MUST keep 
-- elevated permissions to access protected resources like auth.users and admin_users tables:
-- - can_access_manager_sensitive_data
-- - find_user_by_email  
-- - get_super_admin_emails
-- - get_user_admin_role
-- - get_users_identity
-- - handle_new_investor_user
-- - handle_new_manager_user
-- - is_user_admin
-- - log_admin_activity