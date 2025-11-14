-- Create a new RPC function for company managers to assign team members
-- This function checks company management permissions instead of admin status
CREATE OR REPLACE FUNCTION public.assign_company_team_member(
  _profile_id uuid,
  _manager_id uuid,
  _permissions jsonb DEFAULT '{"can_edit_funds": true, "can_manage_team": true, "can_edit_profile": true, "can_view_analytics": true}'::jsonb,
  _status text DEFAULT 'active'::text,
  _notes text DEFAULT NULL::text
)
RETURNS TABLE(user_id uuid, inserted boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _actor UUID := auth.uid();
  _company_name TEXT;
BEGIN
  -- Get company name from profile
  SELECT company_name INTO _company_name
  FROM public.profiles
  WHERE id = _profile_id;

  IF _company_name IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Check if the caller has permission to manage this company
  -- Either they are an admin OR they can manage the company funds
  IF NOT (is_user_admin() OR can_user_manage_company_funds(_actor, _company_name)) THEN
    RAISE EXCEPTION 'Not authorized: You do not have permission to manage this company';
  END IF;

  -- Insert the assignment
  RETURN QUERY
  INSERT INTO public.manager_profile_assignments (
    profile_id, 
    user_id, 
    assigned_by, 
    status, 
    permissions, 
    notes
  )
  VALUES (
    _profile_id,
    _manager_id,
    _actor,
    COALESCE(_status, 'active'),
    COALESCE(_permissions, '{"can_edit_profile": true, "can_edit_funds": true, "can_manage_team": true, "can_view_analytics": true}'::jsonb),
    _notes
  )
  ON CONFLICT ON CONSTRAINT manager_profile_assignments_profile_id_user_id_key DO NOTHING
  RETURNING manager_profile_assignments.user_id, true;
END;
$$;