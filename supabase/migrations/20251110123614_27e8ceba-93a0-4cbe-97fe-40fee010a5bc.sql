-- Create admin_list_profiles function to list all profiles for admins
create or replace function public.admin_list_profiles()
returns table (
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  manager_name text,
  company_name text,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.manager_name,
    p.company_name,
    p.status::text
  from public.profiles p
  where is_user_admin();
$$;

grant execute on function public.admin_list_profiles() to authenticated;