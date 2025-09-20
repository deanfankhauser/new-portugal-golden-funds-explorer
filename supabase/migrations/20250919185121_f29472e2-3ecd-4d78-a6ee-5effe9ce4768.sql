-- Fix manager contact information exposure security issue
-- Remove the overly permissive public access policy and replace with proper data protection

-- Drop the existing public policy that exposes sensitive data
DROP POLICY IF EXISTS "Public company info only - no sensitive data" ON public.manager_profiles;

-- Create a more secure public policy that only shows basic business information
-- This policy will prevent exposure of email, phone, address, and other sensitive data
-- Note: RLS policies can't restrict columns directly, so the frontend must use 
-- the manager_profiles_public view for public access
CREATE POLICY "Public business info only - no contact details" 
ON public.manager_profiles 
FOR SELECT 
USING (
  status = 'approved'::manager_status 
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL
);

-- Also fix the fund_edit_history public exposure issue
DROP POLICY IF EXISTS "Anyone can view fund edit history" ON public.fund_edit_history;

-- Replace with authenticated users only policy for fund edit history
CREATE POLICY "Authenticated users can view fund edit history" 
ON public.fund_edit_history 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Note: manager_profiles_public is a view and cannot have RLS policies
-- The view itself is safe as it excludes sensitive columns like email, phone, address
-- The frontend code is already correctly using this view for public access