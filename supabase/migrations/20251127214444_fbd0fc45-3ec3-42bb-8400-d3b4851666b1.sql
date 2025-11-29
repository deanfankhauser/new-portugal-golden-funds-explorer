-- Add public read access policy for company profiles
-- This enables SSG build-time queries to fetch team members with company names
CREATE POLICY "Public read access to company profiles"
ON public.profiles 
FOR SELECT
USING (company_name IS NOT NULL);