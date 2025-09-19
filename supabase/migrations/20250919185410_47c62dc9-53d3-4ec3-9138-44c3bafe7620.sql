-- Comprehensive fix for Security Definer View issue
-- Remove SECURITY DEFINER from functions that don't need elevated permissions
-- Keep it only for functions that absolutely require access to protected resources

-- Functions that can be safely changed to SECURITY INVOKER:

-- 1. sync_database_functions_to_develop - only reads from information_schema
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

-- 2. update_funds_updated_at - trigger function that only updates timestamps
DROP FUNCTION IF EXISTS public.update_funds_updated_at();
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

-- 3. validate_historical_performance - only validates JSON data structure
DROP FUNCTION IF EXISTS public.validate_historical_performance(jsonb);
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

-- Note: These functions MUST keep SECURITY DEFINER because they need elevated permissions:
-- - can_access_manager_sensitive_data: needs to check admin_users table
-- - find_user_by_email: needs access to auth.users table
-- - get_super_admin_emails: needs access to auth.users table  
-- - get_user_admin_role: needs access to admin_users table
-- - get_users_identity: needs access to auth.users table
-- - handle_new_investor_user: trigger function needs to create profiles
-- - handle_new_manager_user: trigger function needs to create profiles
-- - is_user_admin: needs access to admin_users table
-- - log_admin_activity: needs to write admin logs with proper permissions

-- The remaining SECURITY DEFINER functions are legitimate security functions that require
-- elevated permissions to access protected tables like auth.users and admin_users