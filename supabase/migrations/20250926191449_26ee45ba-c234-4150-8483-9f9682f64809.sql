-- Enhanced security for investor_profiles table
-- This migration implements field-level access controls and enhanced audit logging

-- First, let's create a function that determines what level of access an admin should have
CREATE OR REPLACE FUNCTION public.get_admin_data_access_level()
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    CASE 
      WHEN get_user_admin_role() = 'super_admin'::admin_role THEN 'full'
      WHEN get_user_admin_role() = 'moderator'::admin_role THEN 'limited'
      ELSE 'none'
    END;
$$;

-- Create a function to log and validate sensitive data access
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
  
  -- Log the access attempt
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
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    )
  );
  
  -- Only allow access for legitimate admin roles
  RETURN (access_level IN ('full', 'limited'));
END;
$$;

-- Create a function that returns masked sensitive data based on admin level
CREATE OR REPLACE FUNCTION public.get_masked_investor_data(
  profile_row investor_profiles,
  requesting_user_id UUID DEFAULT auth.uid()
)
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
  access_level TEXT;
  can_access BOOLEAN;
BEGIN
  -- Check if this is the user accessing their own data
  IF profile_row.user_id = requesting_user_id THEN
    -- Users can see their own data
    RETURN QUERY SELECT 
      profile_row.id,
      profile_row.user_id,
      profile_row.first_name,
      profile_row.last_name,
      profile_row.email,
      profile_row.phone,
      profile_row.address,
      profile_row.city,
      profile_row.country,
      profile_row.investment_experience,
      profile_row.risk_tolerance,
      profile_row.annual_income_range,
      profile_row.net_worth_range,
      profile_row.avatar_url,
      profile_row.date_of_birth,
      profile_row.created_at,
      profile_row.updated_at;
    RETURN;
  END IF;
  
  -- For admin access, check permissions and log access
  can_access := log_sensitive_data_access(profile_row.user_id, 'profile_view');
  
  IF NOT can_access THEN
    RETURN; -- No data returned for unauthorized access
  END IF;
  
  access_level := get_admin_data_access_level();
  
  IF access_level = 'full' THEN
    -- Super admins get full access (but it's logged)
    RETURN QUERY SELECT 
      profile_row.id,
      profile_row.user_id,
      profile_row.first_name,
      profile_row.last_name,
      profile_row.email,
      profile_row.phone,
      profile_row.address,
      profile_row.city,
      profile_row.country,
      profile_row.investment_experience,
      profile_row.risk_tolerance,
      profile_row.annual_income_range,
      profile_row.net_worth_range,
      profile_row.avatar_url,
      profile_row.date_of_birth,
      profile_row.created_at,
      profile_row.updated_at;
  ELSIF access_level = 'limited' THEN
    -- Regular admins get masked sensitive data
    RETURN QUERY SELECT 
      profile_row.id,
      profile_row.user_id,
      profile_row.first_name,
      profile_row.last_name,
      profile_row.email, -- Keep email for legitimate business needs
      '[REDACTED]'::TEXT as phone,
      '[REDACTED]'::TEXT as address,
      profile_row.city,
      profile_row.country,
      profile_row.investment_experience,
      profile_row.risk_tolerance,
      '[REDACTED]'::TEXT as annual_income_range,
      '[REDACTED]'::TEXT as net_worth_range,
      profile_row.avatar_url,
      NULL::DATE as date_of_birth,
      profile_row.created_at,
      profile_row.updated_at;
  END IF;
END;
$$;

-- Drop existing overly permissive RLS policies
DROP POLICY IF EXISTS "Admins can view investor profiles" ON public.investor_profiles;
DROP POLICY IF EXISTS "Admins can update investor profiles" ON public.investor_profiles;
DROP POLICY IF EXISTS "Admins can delete investor profiles" ON public.investor_profiles;

-- Create new granular RLS policies

-- Users can always view their own profiles
CREATE POLICY "Users can view own profile"
ON public.investor_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own profiles
CREATE POLICY "Users can update own profile"
ON public.investor_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own profiles
CREATE POLICY "Users can create own profile"
ON public.investor_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can view profiles but with logged access and potential masking
CREATE POLICY "Admins can view profiles with audit"
ON public.investor_profiles
FOR SELECT
TO authenticated
USING (
  -- User can see their own data OR admin with logged access
  auth.uid() = user_id OR 
  log_sensitive_data_access(user_id, 'policy_check')
);

-- Super admins can update profiles (with logging)
CREATE POLICY "Super admins can update profiles"
ON public.investor_profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR 
  (get_user_admin_role() = 'super_admin'::admin_role AND log_sensitive_data_access(user_id, 'profile_update'))
);

-- Only super admins can delete profiles (with logging)
CREATE POLICY "Super admins can delete profiles"
ON public.investor_profiles
FOR DELETE
TO authenticated
USING (
  get_user_admin_role() = 'super_admin'::admin_role AND 
  log_sensitive_data_access(user_id, 'profile_delete')
);

-- Create a secure view for admin access that automatically applies masking
CREATE OR REPLACE VIEW public.investor_profiles_admin_view AS
SELECT 
  m.*
FROM public.investor_profiles p,
LATERAL public.get_masked_investor_data(p) AS m;

-- Grant access to the view
GRANT SELECT ON public.investor_profiles_admin_view TO authenticated;

-- Create RLS policy for the view
ALTER VIEW public.investor_profiles_admin_view SET (security_barrier = true);

-- Update the existing admin function to use the new secure approach
CREATE OR REPLACE FUNCTION public.get_investor_profiles_for_admin_secure()
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
BEGIN
  -- Only allow admin access
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
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
      'function_used', 'get_investor_profiles_for_admin_secure'
    )
  );
  
  -- Return data from the secure view which applies masking automatically
  RETURN QUERY
  SELECT * FROM public.investor_profiles_admin_view;
END;
$$;

-- Create function to get specific investor profile with enhanced security
CREATE OR REPLACE FUNCTION public.get_investor_profile_secure(profile_user_id UUID)
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
BEGIN
  -- Check if user can access this profile
  IF NOT (auth.uid() = profile_user_id OR is_user_admin()) THEN
    RAISE EXCEPTION 'Access denied: Cannot access this profile';
  END IF;
  
  -- Get the profile record
  SELECT * INTO profile_record
  FROM public.investor_profiles
  WHERE investor_profiles.user_id = profile_user_id;
  
  IF NOT FOUND THEN
    RETURN; -- No data found
  END IF;
  
  -- Return masked data based on access level
  RETURN QUERY
  SELECT * FROM public.get_masked_investor_data(profile_record, auth.uid());
END;
$$;

-- Add a function to require explicit approval for accessing sensitive financial data
CREATE OR REPLACE FUNCTION public.request_sensitive_data_access(
  target_user_id UUID,
  justification TEXT,
  requested_fields TEXT[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  request_id UUID;
BEGIN
  -- Only admins can request access
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Super admins have automatic approval
  IF get_user_admin_role() = 'super_admin'::admin_role THEN
    -- Log the access
    PERFORM log_sensitive_data_access(target_user_id, 'sensitive_data_approved_access', requested_fields);
    RETURN gen_random_uuid(); -- Return dummy request ID for consistency
  END IF;
  
  -- For regular admins, create an audit trail but don't grant automatic access
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    'SENSITIVE_DATA_ACCESS_REQUEST',
    'investor_profile',
    target_user_id::text,
    jsonb_build_object(
      'justification', justification,
      'requested_fields', requested_fields,
      'admin_role', get_user_admin_role(),
      'request_time', now(),
      'auto_approved', false
    )
  ) RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$$;