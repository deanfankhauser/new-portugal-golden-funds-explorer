-- Remove test manager assignments
DELETE FROM manager_profile_assignments
WHERE user_id = '7e9c0fd4-bec9-4f26-b999-828e3946996b'
  AND profile_id IN (
    '807f99b0-54e2-4876-8c7f-cdf93d4fc1df',  -- Optimize Investment Partners
    '2a9c5fe4-885b-4c61-93ff-428874d2c381'   -- Saratoga Capital
  )
  AND notes = 'Test assignment for stale lead reminder functionality';