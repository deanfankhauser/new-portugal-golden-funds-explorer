-- Grant super admin access to vuckovaradica@gmail.com (data operation)
INSERT INTO admin_users (user_id, role, granted_by)
VALUES ('799a7713-2217-41a9-bbec-8e94665f6c03', 'super_admin', '91d23f04-e2a2-450f-80b9-5d87b15c5191')
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin',
  granted_at = NOW();