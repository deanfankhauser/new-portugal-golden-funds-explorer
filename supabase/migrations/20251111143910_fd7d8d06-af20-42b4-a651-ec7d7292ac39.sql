-- Drop and recreate admin_list_profiles function without status column
DROP FUNCTION IF EXISTS public.admin_list_profiles();

CREATE FUNCTION public.admin_list_profiles()
 RETURNS TABLE(
   user_id uuid, 
   email text, 
   first_name text, 
   last_name text, 
   manager_name text, 
   company_name text
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.manager_name,
    p.company_name
  from public.profiles p
  where is_user_admin();
$function$;