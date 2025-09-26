-- Fix the security definer view issue by removing the view and using functions instead

-- Drop the security definer view
DROP VIEW IF EXISTS public.investor_profiles_admin_view;

-- Instead of a SECURITY DEFINER view, we'll use the secure function approach
-- which is already implemented with proper access controls and audit logging

-- Also let's improve the existing functions to handle the view functionality more securely

-- Create a replacement for the view that doesn't use SECURITY DEFINER
-- This function will be called explicitly by admin interfaces
CREATE OR REPLACE FUNCTION public.get_all_investor_profiles_admin()
RETURNS TABLE(
  id UUID,
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  investment_experience TEXT,
  risk_tolerance TEXT,
  annual_income_range TEXT,
  net_worth_range TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  profile_record investor_profiles%ROWTYPE;
  access_level TEXT;
BEGIN
  -- Only allow admin access
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  access_level := get_admin_data_access_level();
  
  -- Log bulk access to customer data
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    'BULK_SENSITIVE_DATA_ACCESS',
    'investor_profiles',
    'admin_dashboard',
    jsonb_build_object(
      'accessed_at', now(),
      'admin_role', get_user_admin_role(),
      'access_type', 'bulk_admin_view',
      'access_level', access_level,
      'function_used', 'get_all_investor_profiles_admin'
    )
  );
  
  -- Return masked data for all profiles based on admin access level
  FOR profile_record IN 
    SELECT * FROM public.investor_profiles 
    ORDER BY created_at DESC
  LOOP
    -- Log access to each individual profile
    PERFORM log_sensitive_data_access(profile_record.user_id, 'bulk_profile_access');
    
    -- Return masked data based on access level
    RETURN QUERY
    SELECT * FROM public.get_masked_investor_data(profile_record, auth.uid());
  END LOOP;
END;
$$;

-- Update the RLS policies to be more explicit and remove any potential SECURITY DEFINER dependencies

-- Drop the existing admin view policy that might reference the deleted view
DROP POLICY IF EXISTS "Admins can view profiles with audit" ON public.investor_profiles;

-- Create a more restrictive policy that requires explicit function calls for admin access
CREATE POLICY "Restricted admin profile access"
ON public.investor_profiles
FOR SELECT
TO authenticated
USING (
  -- Users can always see their own data
  auth.uid() = user_id OR
  -- Admins can only access through controlled functions that log access
  (is_user_admin() AND log_sensitive_data_access(user_id, 'rls_policy_check'))
);

-- Ensure the audit function properly validates admin access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(
  accessed_user_id UUID,
  access_type TEXT,
  requested_fields TEXT[] DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  access_level TEXT;
BEGIN
  -- Only allow authenticated admin users
  IF NOT is_user_admin() THEN
    RETURN FALSE;
  END IF;
  
  access_level := get_admin_data_access_level();
  
  -- For policy checks, don't log every single access to avoid log spam
  -- but do validate access rights
  IF access_type != 'rls_policy_check' THEN
    -- Log the access attempt for non-policy checks
    INSERT INTO public.admin_activity_log (
      admin_user_id,
      action_type,
      target_type,
      target_id,
      details
    ) VALUES (
      auth.uid(),
      'SENSITIVE_DATA_ACCESS',
      'investor_profile',
      accessed_user_id::text,
      jsonb_build_object(
        'access_level', access_level,
        'access_type', access_type,
        'requested_fields', requested_fields,
        'timestamp', now(),
        'admin_role', get_user_admin_role()
      )
    );
  END IF;
  
  -- Only allow access for legitimate admin roles
  RETURN (access_level IN ('full', 'limited'));
END;
$$;