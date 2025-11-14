-- Assign user to Saratoga Capital profile for testing
INSERT INTO manager_profile_assignments (
  profile_id,
  user_id,
  assigned_by,
  status,
  permissions,
  notes
) VALUES (
  '2a9c5fe4-885b-4c61-93ff-428874d2c381',
  '7e9c0fd4-bec9-4f26-b999-828e3946996b',
  '7e9c0fd4-bec9-4f26-b999-828e3946996b',
  'active',
  '{"can_edit_profile": true, "can_edit_funds": true, "can_manage_team": false, "can_view_analytics": true}'::jsonb,
  'Test assignment for stale lead reminder functionality'
) ON CONFLICT (profile_id, user_id) DO UPDATE SET
  status = 'active',
  updated_at = now();