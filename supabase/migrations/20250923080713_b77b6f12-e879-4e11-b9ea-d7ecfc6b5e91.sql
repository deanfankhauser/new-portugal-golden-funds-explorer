-- Create a secure RPC function to execute SQL for database sync operations
CREATE OR REPLACE FUNCTION public.query(query_text text)
RETURNS TABLE(result text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admin users to execute raw SQL
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Log the SQL execution
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    'SQL_EXECUTION',
    'database_sync',
    'full_sync',
    jsonb_build_object(
      'query_length', length(query_text),
      'executed_at', now()
    )
  );
  
  -- Execute the query (for DDL operations like CREATE FUNCTION, CREATE TRIGGER)
  EXECUTE query_text;
  
  RETURN QUERY SELECT 'Query executed successfully'::text;
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT format('Error: %s', SQLERRM)::text;
END;
$$;