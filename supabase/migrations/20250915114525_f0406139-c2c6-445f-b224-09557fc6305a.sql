-- Add sofiia.korniienko@skynix.co as super admin
DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Find the user by email
    SELECT find_user_by_email('sofiia.korniienko@skynix.co') INTO user_uuid;
    
    -- Only insert if user exists and is not already an admin
    IF user_uuid IS NOT NULL THEN
        INSERT INTO public.admin_users (user_id, role, granted_by)
        VALUES (user_uuid, 'super_admin', user_uuid)
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;