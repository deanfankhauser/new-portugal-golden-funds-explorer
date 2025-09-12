-- Create admin role enum
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'moderator',
  granted_by UUID NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Super admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (get_user_admin_role() = 'super_admin'::admin_role);

CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (is_user_admin());

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = check_user_id
  );
$$;

-- Create function to get user admin role
CREATE OR REPLACE FUNCTION public.get_user_admin_role(check_user_id UUID DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.admin_users 
  WHERE user_id = check_user_id;
$$;

-- Create function to find user by email
CREATE OR REPLACE FUNCTION public.find_user_by_email(user_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_user_id UUID;
BEGIN
  -- First try to find in manager profiles
  SELECT user_id INTO found_user_id
  FROM public.manager_profiles
  WHERE email = user_email
  LIMIT 1;
  
  -- If not found, try investor profiles
  IF found_user_id IS NULL THEN
    SELECT user_id INTO found_user_id
    FROM public.investor_profiles
    WHERE email = user_email
    LIMIT 1;
  END IF;
  
  -- If still not found, try to find in auth.users directly
  IF found_user_id IS NULL THEN
    SELECT id INTO found_user_id
    FROM auth.users
    WHERE email = user_email
    LIMIT 1;
  END IF;
  
  RETURN found_user_id;
END;
$$;

-- Create admin activity log table
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_activity_log
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_activity_log
CREATE POLICY "Admins can view all activity logs" 
ON public.admin_activity_log 
FOR SELECT 
USING (is_user_admin());

CREATE POLICY "Admins can create activity logs" 
ON public.admin_activity_log 
FOR INSERT 
WITH CHECK (is_user_admin() AND auth.uid() = admin_user_id);

-- Create function to log admin activity
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action_type TEXT,
  p_target_type TEXT,
  p_target_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_target_type,
    p_target_id,
    p_details
  );
END;
$$;