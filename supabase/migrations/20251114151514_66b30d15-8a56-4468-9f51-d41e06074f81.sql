-- Fix ambiguous column reference in get_fund_manager_sign_ins()
CREATE OR REPLACE FUNCTION public.get_fund_manager_sign_ins()
RETURNS TABLE(
  fund_id text,
  fund_name text,
  manager_name text,
  company_name text,
  manager_email text,
  last_sign_in_at timestamptz,
  total_leads bigint,
  recent_leads bigint,
  total_impressions bigint,
  recent_impressions bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admins
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    f.id::text AS fund_id,
    f.name AS fund_name,
    f.manager_name,
    p.company_name,
    p.email AS manager_email,
    MAX(au.last_sign_in_at) AS last_sign_in_at,
    COUNT(DISTINCT fe.id) AS total_leads,
    COUNT(DISTINCT CASE WHEN fe.created_at >= NOW() - INTERVAL '30 days' THEN fe.id END) AS recent_leads,
    COUNT(DISTINCT fpv.id) AS total_impressions,
    COUNT(DISTINCT CASE WHEN fpv.viewed_at >= NOW() - INTERVAL '30 days' THEN fpv.id END) AS recent_impressions
  FROM public.funds f
  LEFT JOIN public.profiles p
    ON p.company_name = f.manager_name
  LEFT JOIN public.manager_profile_assignments mpa
    ON mpa.profile_id = p.id
   AND mpa.status = 'active'
  LEFT JOIN auth.users au
    ON au.id = mpa.user_id
  LEFT JOIN public.fund_enquiries fe
    ON fe.fund_id = f.id
  LEFT JOIN public.fund_page_views fpv
    ON fpv.fund_id = f.id
  GROUP BY f.id, f.name, f.manager_name, p.company_name, p.email
  ORDER BY recent_impressions DESC NULLS LAST, recent_leads DESC NULLS LAST;
END;
$function$;