-- Create function to copy database functions from production to develop
-- This function will extract and replicate all custom database functions

CREATE OR REPLACE FUNCTION public.sync_database_functions_to_develop()
RETURNS TABLE(
  function_name text,
  function_definition text,
  status text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- This function helps prepare database function definitions for manual migration
  -- Since we cannot directly execute DDL across databases from a function,
  -- this returns the function definitions that need to be manually applied
  
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

-- Create function to sync funds data specifically
CREATE OR REPLACE FUNCTION public.copy_funds_to_develop()
RETURNS TABLE(
  operation text,
  status text,
  details text,
  record_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Create admin function to get database schema information
CREATE OR REPLACE FUNCTION public.get_database_schema_info()
RETURNS TABLE(
  table_name text,
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
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