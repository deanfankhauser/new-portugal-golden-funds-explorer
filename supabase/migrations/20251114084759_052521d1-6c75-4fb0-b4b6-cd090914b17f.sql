-- Temporary assignment for testing stale lead reminder
INSERT INTO manager_profile_assignments (
  profile_id,
  user_id,
  assigned_by,
  status,
  permissions,
  notes
) VALUES (
  '807f99b0-54e2-4876-8c7f-cdf93d4fc1df',
  '7e9c0fd4-bec9-4f26-b999-828e3946996b',
  '7e9c0fd4-bec9-4f26-b999-828e3946996b',
  'active',
  '{"can_edit_profile": true, "can_edit_funds": true, "can_manage_team": false, "can_view_analytics": true}'::jsonb,
  'Test assignment for stale lead reminder functionality'
) ON CONFLICT (profile_id, user_id) DO UPDATE SET
  status = 'active',
  updated_at = now();