-- Approve all pending manager profiles
UPDATE manager_profiles 
SET status = 'approved'::manager_status,
    approved_at = now(),
    approved_by = (SELECT user_id FROM admin_users WHERE role = 'super_admin' LIMIT 1)
WHERE status = 'pending'::manager_status;