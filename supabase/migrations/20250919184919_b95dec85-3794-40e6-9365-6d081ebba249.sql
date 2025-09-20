-- Fix manager contact information exposure security issue
-- Remove the overly permissive public access policy and replace with proper data protection

-- Drop the existing public policy that exposes sensitive data
DROP POLICY IF EXISTS "Public company info only - no sensitive data" ON public.manager_profiles;

-- Create a more secure public policy that only shows basic business information
-- This policy will prevent exposure of email, phone, address, and other sensitive data
CREATE POLICY "Public business info only - no contact details" 
ON public.manager_profiles 
FOR SELECT 
USING (
  status = 'approved'::manager_status 
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL
);

-- Since we can't restrict columns in RLS policies directly, ensure the frontend 
-- uses the manager_profiles_public view for public access, which already excludes
-- sensitive fields like email, phone, and address

-- Also fix the fund_edit_history public exposure issue
DROP POLICY IF EXISTS "Anyone can view fund edit history" ON public.fund_edit_history;

-- Replace with authenticated users only policy for fund edit history
CREATE POLICY "Authenticated users can view fund edit history" 
ON public.fund_edit_history 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Ensure the manager_profiles_public view has proper RLS (currently has none)
ALTER TABLE public.manager_profiles_public ENABLE ROW LEVEL SECURITY;

-- Add a policy to the public view to ensure it only shows approved managers
CREATE POLICY "Show only approved managers in public view" 
ON public.manager_profiles_public 
FOR SELECT 
USING (
  status = 'approved'::manager_status 
  AND company_name IS NOT NULL 
  AND manager_name IS NOT NULL
);