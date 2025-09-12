-- Add the current user as an admin
INSERT INTO public.admin_users (user_id, role) 
VALUES ('2b6c68a6-7cbe-4197-b453-e23c041486f8', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Also add a function to easily make users admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert or update admin status
  INSERT INTO public.admin_users (user_id, role) 
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  
  RAISE NOTICE 'User % (%) is now an admin', user_email, target_user_id;
END;
$$;