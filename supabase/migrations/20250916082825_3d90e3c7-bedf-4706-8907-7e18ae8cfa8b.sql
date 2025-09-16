-- Create function to get super admin emails for notifications
CREATE OR REPLACE FUNCTION public.get_super_admin_emails()
RETURNS TABLE(email text, admin_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  WITH super_admins AS (
    SELECT user_id
    FROM public.admin_users
    WHERE role = 'super_admin'::admin_role
  )
  SELECT 
    COALESCE(mp.email, ip.email, au.email) as email,
    COALESCE(
      NULLIF(TRIM(mp.manager_name || ' (' || mp.company_name || ')'), '()'),
      NULLIF(TRIM(ip.first_name || ' ' || ip.last_name), ''),
      split_part(au.email, '@', 1)
    ) as admin_name
  FROM super_admins sa
  LEFT JOIN public.manager_profiles mp ON mp.user_id = sa.user_id
  LEFT JOIN public.investor_profiles ip ON ip.user_id = sa.user_id
  LEFT JOIN auth.users au ON au.id = sa.user_id
  WHERE COALESCE(mp.email, ip.email, au.email) IS NOT NULL;
$$;