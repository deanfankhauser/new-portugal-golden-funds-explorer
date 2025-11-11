-- Fix admin_assign_profile_managers function to resolve ambiguous column references
CREATE OR REPLACE FUNCTION public.admin_assign_profile_managers(
  _profile_id UUID,
  _manager_ids UUID[],
  _permissions JSONB DEFAULT '{"can_edit_profile": true, "can_edit_funds": false, "can_manage_team": false, "can_view_analytics": true}'::jsonb,
  _status TEXT DEFAULT 'active',
  _notes TEXT DEFAULT NULL
)
RETURNS TABLE(user_id UUID, inserted BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _actor UUID := auth.uid();
BEGIN
  -- Ensure only admins can call this
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Not authorized: Admin privileges required';
  END IF;

  -- Basic validation
  IF _profile_id IS NULL THEN
    RAISE EXCEPTION 'Invalid profile_id';
  END IF;

  IF _manager_ids IS NULL OR array_length(_manager_ids, 1) IS NULL OR array_length(_manager_ids, 1) = 0 THEN
    RAISE EXCEPTION 'No managers provided';
  END IF;

  RETURN QUERY
  WITH input_ids AS (
    -- Remove nulls and duplicates defensively
    SELECT DISTINCT u AS uid
    FROM unnest(_manager_ids) AS u
    WHERE u IS NOT NULL
  ),
  inserted AS (
    INSERT INTO public.manager_profile_assignments (profile_id, user_id, assigned_by, status, permissions, notes)
    SELECT
      _profile_id,
      i.uid,
      _actor,
      COALESCE(_status, 'active'),
      COALESCE(_permissions, '{"can_edit_profile": true, "can_edit_funds": false, "can_manage_team": false, "can_view_analytics": true}'::jsonb),
      _notes
    FROM input_ids i
    ON CONFLICT (profile_id, user_id) DO NOTHING
    RETURNING manager_profile_assignments.user_id AS returned_uid
  )
  SELECT i.uid::UUID, (ins.returned_uid IS NOT NULL)::BOOLEAN
  FROM input_ids i
  LEFT JOIN inserted ins ON ins.returned_uid = i.uid;
END;
$$;