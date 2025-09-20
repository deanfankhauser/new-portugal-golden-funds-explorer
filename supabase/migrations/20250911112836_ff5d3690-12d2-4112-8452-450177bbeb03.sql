-- Create a test admin user
-- Note: This assumes there's at least one user in the auth.users table
-- In production, you would manually insert the admin user after they register

-- For now, create a placeholder comment for manual admin setup
-- To add an admin in production:
-- 1. User registers normally through the app
-- 2. Admin manually runs: INSERT INTO public.admin_users (user_id, role, granted_by) VALUES ('user_id_here', 'super_admin', 'user_id_here');

-- Add a sample data comment for testing
COMMENT ON TABLE public.admin_users IS 'To add an admin: INSERT INTO public.admin_users (user_id, role, granted_by) VALUES (''user_uuid'', ''super_admin'', ''user_uuid'');';