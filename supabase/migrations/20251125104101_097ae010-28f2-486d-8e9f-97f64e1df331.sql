-- Create RPC function to fetch team members by company name
-- This function bypasses RLS to allow public access to team member data
CREATE OR REPLACE FUNCTION public.get_team_members_by_company_name(company_name_input text)
RETURNS TABLE (
  id uuid,
  slug text,
  name text,
  role text,
  bio text,
  photo_url text,
  linkedin_url text,
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tm.id,
    tm.slug,
    tm.name,
    tm.role,
    tm.bio,
    tm.photo_url,
    tm.linkedin_url,
    tm.email
  FROM team_members tm
  JOIN profiles p ON tm.profile_id = p.id
  WHERE p.company_name ILIKE company_name_input
  ORDER BY tm.created_at ASC;
END;
$$;