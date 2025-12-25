-- Add RLS policy allowing super admins to insert profiles
CREATE POLICY "Super admins can insert profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (get_user_admin_role() = 'super_admin'::admin_role);