-- STEP 4: FIX FUNCTION SECURITY DEFINER AND SEARCH PATH ISSUES

-- Fix the function to have proper search path and security settings
CREATE OR REPLACE FUNCTION public.check_sensitive_data_exposure()
RETURNS TABLE(
    view_name text,
    has_sensitive_columns boolean,
    sensitive_columns text[]
) 
LANGUAGE plpgsql 
SECURITY INVOKER  -- Use security invoker instead of definer
SET search_path = public  -- Set explicit search path for security
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.table_name::text as view_name,
        bool_or(c.column_name IN ('email', 'phone', 'address', 'license_number', 'registration_number')) as has_sensitive_columns,
        array_agg(c.column_name) FILTER (WHERE c.column_name IN ('email', 'phone', 'address', 'license_number', 'registration_number')) as sensitive_columns
    FROM information_schema.columns c
    JOIN information_schema.tables t ON t.table_name = c.table_name
    WHERE t.table_schema = 'public' 
      AND t.table_type = 'VIEW'
      AND c.table_schema = 'public'
    GROUP BY c.table_name
    HAVING bool_or(c.column_name IN ('email', 'phone', 'address', 'license_number', 'registration_number'));
END;
$$;

-- Also fix any existing functions that might have security definer without proper search path
-- Update the update_updated_at_column function to have explicit search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add comprehensive security documentation
COMMENT ON FUNCTION public.check_sensitive_data_exposure() IS 
'Security monitoring function with SECURITY INVOKER and explicit search_path. Detects views that accidentally expose sensitive manager data. Safe for authenticated users to run.';

COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Trigger function for updating updated_at timestamps. Uses explicit search_path for security.';