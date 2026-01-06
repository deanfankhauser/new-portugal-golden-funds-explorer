-- Allow public to view approved company profiles for team member carousels
CREATE POLICY "Public can view approved company profiles"
ON public.profiles
FOR SELECT
TO public
USING (
  company_name IS NOT NULL
);