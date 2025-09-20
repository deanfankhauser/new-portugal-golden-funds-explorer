-- Add admin policies to allow admins to view all user profiles for display purposes

-- Policy for manager_profiles: Allow admins to view all manager profiles
CREATE POLICY "Admins can view all manager profiles" 
ON public.manager_profiles 
FOR SELECT 
USING (is_user_admin());

-- Policy for investor_profiles: Allow admins to view all investor profiles  
CREATE POLICY "Admins can view all investor profiles"
ON public.investor_profiles
FOR SELECT
USING (is_user_admin());