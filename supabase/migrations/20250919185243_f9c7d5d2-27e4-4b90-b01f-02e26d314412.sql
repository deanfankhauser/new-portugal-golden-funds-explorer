-- Fix Security Definer View issue by removing unnecessary SECURITY DEFINER properties
-- Keep SECURITY DEFINER only for functions that legitimately need elevated permissions

-- Drop functions that don't need SECURITY DEFINER and recreate them without it
-- These functions access only public schema data that users already have access to

-- 1. Remove SECURITY DEFINER from get_database_schema_info (if it's not actually needed)
-- This function only reads information_schema which is generally accessible
DROP FUNCTION IF EXISTS public.get_database_schema_info();

CREATE OR REPLACE FUNCTION public.get_database_schema_info()
RETURNS TABLE(table_name text, column_name text, data_type text, is_nullable text, column_default text)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT 
    t.table_name::text,
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.tables t
  JOIN information_schema.columns c ON t.table_name = c.table_name
  WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
    AND c.table_schema = 'public'
  ORDER BY t.table_name, c.ordinal_position;
$function$;

-- 2. Remove SECURITY DEFINER from copy_funds_to_develop (development utility)
-- This function only reads from public.funds which users already have access to
DROP FUNCTION IF EXISTS public.copy_funds_to_develop();

CREATE OR REPLACE FUNCTION public.copy_funds_to_develop()
RETURNS TABLE(operation text, status text, details text, record_count integer)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
DECLARE
  fund_record RECORD;
  total_funds INTEGER := 0;
BEGIN
  -- Count total funds
  SELECT COUNT(*) INTO total_funds FROM public.funds;
  
  RETURN QUERY
  SELECT 
    'count_funds'::text as operation,
    'success'::text as status,
    'Found funds in production'::text as details,
    total_funds as record_count;
  
  -- This function prepares fund data for external sync
  -- The actual cross-database operation must be handled by edge functions
  -- due to security and connection limitations
  
  RETURN QUERY
  SELECT 
    'prepare_funds_sync'::text as operation,
    'ready'::text as status,
    'Fund data ready for external sync via edge function'::text as details,
    total_funds as record_count;
    
END;
$function$;

-- Note: The following functions legitimately need SECURITY DEFINER and should NOT be changed:
-- - can_access_manager_sensitive_data: Needs to access admin_users table
-- - get_user_admin_role: Needs to access admin_users table  
-- - is_user_admin: Needs to access admin_users table
-- - get_super_admin_emails: Needs to access auth.users table
-- - find_user_by_email: Needs to access auth.users table
-- - handle_new_investor_user: Trigger function needs elevated permissions
-- - handle_new_manager_user: Trigger function needs elevated permissions
-- - log_admin_activity: Needs to write to admin logs with elevated permissions
-- - get_users_identity: Needs to access auth.users table