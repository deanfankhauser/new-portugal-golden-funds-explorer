-- Fix investor_profiles access in Funds_Develop
-- Drop existing restrictive policies and create simpler ones for development

DROP POLICY IF EXISTS "Regular admins can view basic investor info" ON public.investor_profiles;
DROP POLICY IF EXISTS "Super admins can view all investor profiles with logging" ON public.investor_profiles;

-- Create admin access policy for development (less restrictive)
CREATE POLICY "Admins can view investor profiles"
ON public.investor_profiles FOR SELECT
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid()
  )
);

-- Create basic admin management policies
CREATE POLICY "Admins can update investor profiles"
ON public.investor_profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete investor profiles"
ON public.investor_profiles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid()
  )
);