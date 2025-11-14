-- Create function to get fund manager sign-in data with leads and impressions
CREATE OR REPLACE FUNCTION public.get_fund_manager_sign_ins()
RETURNS TABLE(
  fund_id text,
  fund_name text,
  manager_name text,
  company_name text,
  manager_email text,
  last_sign_in_at timestamp with time zone,
  total_leads bigint,
  recent_leads bigint,
  total_impressions bigint,
  recent_impressions bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    f.id as fund_id,
    f.name as fund_name,
    f.manager_name,
    p.company_name,
    p.email as manager_email,
    au.last_sign_in_at,
    COUNT(DISTINCT fe.id) as total_leads,
    COUNT(DISTINCT CASE WHEN fe.created_at >= NOW() - INTERVAL '30 days' THEN fe.id END) as recent_leads,
    COUNT(DISTINCT fpv.id) as total_impressions,
    COUNT(DISTINCT CASE WHEN fpv.viewed_at >= NOW() - INTERVAL '30 days' THEN fpv.id END) as recent_impressions
  FROM public.funds f
  LEFT JOIN public.fund_enquiries fe ON fe.fund_id = f.id
  LEFT JOIN public.fund_page_views fpv ON fpv.fund_id = f.id
  LEFT JOIN public.manager_profile_assignments mpa ON mpa.profile_id IN (
    SELECT id FROM public.profiles WHERE company_name = f.manager_name
  ) AND mpa.status = 'active'
  LEFT JOIN public.profiles p ON p.id = mpa.profile_id
  LEFT JOIN auth.users au ON au.id = mpa.user_id
  GROUP BY f.id, f.name, f.manager_name, p.company_name, p.email, au.last_sign_in_at
  ORDER BY recent_impressions DESC NULLS LAST, recent_leads DESC NULLS LAST;
END;
$$;