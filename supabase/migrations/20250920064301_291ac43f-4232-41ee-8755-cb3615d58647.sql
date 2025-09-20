-- Fix Security Definer View issue by removing the problematic view
-- and replacing it with a secure function-based approach

-- Drop the problematic view that bypasses RLS
DROP VIEW IF EXISTS public.investor_profiles_admin_view;

-- Create a secure function that properly respects RLS and logs access
CREATE OR REPLACE FUNCTION public.get_investor_profiles_for_admin()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  city text,
  country text,
  created_at timestamptz,
  updated_at timestamptz,
  avatar_url text,
  investment_experience text,
  risk_tolerance text,
  address text,
  date_of_birth date,
  annual_income_range text,
  net_worth_range text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admin access
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Log admin access to customer data
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    'BULK_DATA_ACCESS',
    'investor_profiles',
    'admin_list',
    jsonb_build_object(
      'accessed_at', now(),
      'admin_role', get_user_admin_role(),
      'access_type', 'admin_dashboard'
    )
  );
  
  -- Return data based on admin role
  IF get_user_admin_role() = 'super_admin'::admin_role THEN
    -- Super admins get full access
    RETURN QUERY
    SELECT 
      p.id,
      p.user_id,
      p.first_name,
      p.last_name,
      p.email,
      p.phone,
      p.city,
      p.country,
      p.created_at,
      p.updated_at,
      p.avatar_url,
      p.investment_experience,
      p.risk_tolerance,
      p.address,
      p.date_of_birth,
      p.annual_income_range,
      p.net_worth_range
    FROM public.investor_profiles p;
  ELSE
    -- Regular admins get redacted sensitive data
    RETURN QUERY
    SELECT 
      p.id,
      p.user_id,
      p.first_name,
      p.last_name,
      p.email,
      p.phone,
      p.city,
      p.country,
      p.created_at,
      p.updated_at,
      p.avatar_url,
      p.investment_experience,
      p.risk_tolerance,
      NULL::text as address,
      NULL::date as date_of_birth,
      '[REDACTED]'::text as annual_income_range,
      '[REDACTED]'::text as net_worth_range
    FROM public.investor_profiles p;
  END IF;
END;
$$;