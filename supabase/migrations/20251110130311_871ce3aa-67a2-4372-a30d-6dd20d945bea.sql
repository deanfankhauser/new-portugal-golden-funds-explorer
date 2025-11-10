-- Fix ambiguous column reference in admin_assign_fund_managers
create or replace function public.admin_assign_fund_managers(
  _fund_id text,
  _manager_ids uuid[],
  _permissions jsonb default '{"can_edit": true, "can_publish": false}'::jsonb,
  _status text default 'active',
  _notes text default null
)
returns table (
  user_id uuid,
  inserted boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  _actor uuid := auth.uid();
begin
  -- Ensure only admins can call this
  if not is_user_admin() then
    raise exception 'Not authorized: Admin privileges required';
  end if;

  return query
  with input_ids as (
    select unnest(_manager_ids) as user_id
  ),
  inserted as (
    insert into public.fund_managers (fund_id, user_id, assigned_by, status, permissions, notes)
    select
      _fund_id,
      i.user_id,
      _actor,
      coalesce(_status, 'active'),
      coalesce(_permissions, '{"can_edit": true, "can_publish": false}'::jsonb),
      _notes
    from input_ids i
    on conflict on constraint fund_managers_fund_id_user_id_key do nothing
    returning fund_managers.user_id
  )
  select i.user_id, (ins.user_id is not null) as inserted
  from input_ids i
  left join inserted ins on ins.user_id = i.user_id;
end;
$$;