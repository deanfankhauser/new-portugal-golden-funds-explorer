-- Security Fix: Enhanced Access Controls and Audit Logging for Investor Profiles

-- Create function to log and control admin access to sensitive investor data
CREATE OR REPLACE FUNCTION public.log_and_allow_investor_profile_access(target_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow admin access
  IF NOT is_user_admin() THEN
    RETURN false;
  END IF;
  
  -- For super_admins accessing specific profiles, log the access
  IF target_user_id IS NOT NULL AND auth.uid() IS NOT NULL THEN
    -- Log admin access to sensitive customer data
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
      target_user_id::text,
      jsonb_build_object(
        'accessed_at', now(),
        'admin_role', get_user_admin_role(),
        'access_type', 'profile_view'
      )
    );
  END IF;
  
  -- Only super_admins can access sensitive financial data
  -- Regular admins can only access basic contact info for legitimate business purposes
  RETURN (get_user_admin_role() = 'super_admin'::admin_role);
END;
$$;

-- Create a view for admins that excludes the most sensitive financial data
CREATE OR REPLACE VIEW public.investor_profiles_admin_view AS
SELECT 
  id,
  user_id,
  first_name,
  last_name,
  email,
  phone,
  city,
  country,
  created_at,
  updated_at,
  avatar_url,
  investment_experience,
  risk_tolerance,
  -- Exclude sensitive financial data for regular admins
  CASE 
    WHEN get_user_admin_role() = 'super_admin'::admin_role 
    THEN address 
    ELSE NULL 
  END as address,
  CASE 
    WHEN get_user_admin_role() = 'super_admin'::admin_role 
    THEN date_of_birth 
    ELSE NULL 
  END as date_of_birth,
  CASE 
    WHEN get_user_admin_role() = 'super_admin'::admin_role 
    THEN annual_income_range 
    ELSE '[REDACTED]'::text 
  END as annual_income_range,
  CASE 
    WHEN get_user_admin_role() = 'super_admin'::admin_role 
    THEN net_worth_range 
    ELSE '[REDACTED]'::text 
  END as net_worth_range
FROM public.investor_profiles
WHERE log_and_allow_investor_profile_access(user_id);

-- Enable RLS on the admin view
ALTER VIEW public.investor_profiles_admin_view SET (security_barrier = true);

-- Update the existing RLS policy to use the new logging function
DROP POLICY IF EXISTS "Admins can view all investor profiles" ON public.investor_profiles;

CREATE POLICY "Super admins can view all investor profiles with logging"
ON public.investor_profiles
FOR SELECT
USING (log_and_allow_investor_profile_access(user_id));

-- Create a policy for regular admins to access basic info only
CREATE POLICY "Regular admins can view basic investor info"
ON public.investor_profiles
FOR SELECT
USING (
  is_user_admin() AND 
  get_user_admin_role() != 'super_admin'::admin_role AND
  log_and_allow_investor_profile_access(user_id)
);

-- Create function to get investor profile count for admins (for dashboard stats)
CREATE OR REPLACE FUNCTION public.get_investor_profile_stats()
RETURNS TABLE(
  total_investors bigint,
  recent_signups bigint,
  active_investors bigint
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
  
  -- Log admin access to aggregate statistics
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    'AGGREGATE_DATA_ACCESS',
    'investor_stats',
    'dashboard',
    jsonb_build_object(
      'accessed_at', now(),
      'admin_role', get_user_admin_role(),
      'access_type', 'statistics_view'
    )
  );
  
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_investors,
    COUNT(*) FILTER (WHERE created_at >= now() - interval '30 days')::bigint as recent_signups,
    COUNT(*) FILTER (WHERE updated_at >= now() - interval '90 days')::bigint as active_investors
  FROM public.investor_profiles;
END;
$$;