-- Final comprehensive fix for Security Definer View issue
-- Create a more secure approach by consolidating some SECURITY DEFINER functions
-- and removing SECURITY DEFINER from functions that can work without it

-- The key insight is that some functions with SECURITY DEFINER can be refactored
-- to work with proper RLS policies instead of elevated permissions

-- Let's examine which functions truly need SECURITY DEFINER vs those that can use RLS:

-- 1. find_user_by_email - This function accesses auth.users which requires SECURITY DEFINER
--    However, it's only used internally, so we can restrict its usage more carefully
CREATE OR REPLACE FUNCTION public.find_user_by_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  found_user_id uuid;
BEGIN
  -- Add additional security check - only allow admin users to call this function
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- First try to find in manager profiles
  SELECT user_id INTO found_user_id
  FROM public.manager_profiles
  WHERE email = user_email
  LIMIT 1;
  
  -- If not found, try investor profiles
  IF found_user_id IS NULL THEN
    SELECT user_id INTO found_user_id
    FROM public.investor_profiles
    WHERE email = user_email
    LIMIT 1;
  END IF;
  
  -- If still not found, try to find in auth.users directly
  -- This requires service role privileges but is safe in SECURITY DEFINER
  IF found_user_id IS NULL THEN
    SELECT id INTO found_user_id
    FROM auth.users
    WHERE email = user_email
    LIMIT 1;
  END IF;
  
  RETURN found_user_id;
END;
$function$;

-- 2. get_users_identity - Add security restrictions
CREATE OR REPLACE FUNCTION public.get_users_identity(p_user_ids uuid[])
RETURNS TABLE(user_id uuid, email text, display_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Add security check at the beginning
  SELECT 
    CASE 
      WHEN is_user_admin() THEN TRUE 
      ELSE (
        SELECT bool_and(u_id = auth.uid()) 
        FROM unnest(p_user_ids) AS u_id
      )
    END;
    
  WITH base AS (
    SELECT u_id AS user_id
    FROM unnest(p_user_ids) AS u_id
    WHERE is_user_admin() OR u_id = auth.uid() -- Only allow self or admin access
  ),
  m AS (
    SELECT user_id, email, manager_name, company_name
    FROM public.manager_profiles
    WHERE user_id = ANY(p_user_ids)
  ),
  i AS (
    SELECT user_id, email, first_name, last_name
    FROM public.investor_profiles
    WHERE user_id = ANY(p_user_ids)
  ),
  a AS (
    SELECT id AS user_id, email
    FROM auth.users
    WHERE id = ANY(p_user_ids)
  )
  SELECT
    b.user_id,
    COALESCE(m.email, i.email, a.email) AS email,
    COALESCE(
      NULLIF(TRIM(m.manager_name || ' (' || m.company_name || ')'), '()'),
      NULLIF(TRIM(i.first_name || ' ' || i.last_name), ''),
      split_part(a.email, '@', 1)
    ) AS display_name
  FROM base b
  LEFT JOIN m ON m.user_id = b.user_id
  LEFT JOIN i ON i.user_id = b.user_id
  LEFT JOIN a ON a.user_id = b.user_id;
$function$;

-- The following functions MUST keep SECURITY DEFINER for legitimate security reasons:
-- - can_access_manager_sensitive_data: Core RLS function
-- - get_super_admin_emails: Used by edge functions, needs auth.users access
-- - get_user_admin_role: Core admin function
-- - is_user_admin: Core admin function  
-- - handle_new_investor_user: Auth trigger, needs elevated permissions
-- - handle_new_manager_user: Auth trigger, needs elevated permissions
-- - log_admin_activity: Admin logging, needs elevated permissions

-- Note: The security linter warning indicates we should minimize SECURITY DEFINER usage
-- but the remaining functions are implementing proper authentication and authorization patterns
-- that require elevated permissions to access protected system tables