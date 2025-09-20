-- Add the current user as a super admin
INSERT INTO public.admin_users (user_id, role, granted_by) 
VALUES ('2b6c68a6-7cbe-4197-b453-e23c041486f8', 'super_admin', '2b6c68a6-7cbe-4197-b453-e23c041486f8')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';