-- Drop and recreate the RPC function with new fields
DROP FUNCTION IF EXISTS public.get_team_members_by_company_name(text);

CREATE FUNCTION public.get_team_members_by_company_name(company_name_input text)
 RETURNS TABLE(id uuid, slug text, name text, role text, bio text, photo_url text, linkedin_url text, email text, location text, languages text[], team_since date, education text, certifications text[])
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Early return for null or empty input to prevent matching all records
  IF company_name_input IS NULL OR TRIM(company_name_input) = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    tm.id,
    tm.slug,
    tm.name,
    tm.role,
    tm.bio,
    tm.photo_url,
    tm.linkedin_url,
    tm.email,
    tm.location,
    tm.languages,
    tm.team_since,
    tm.education,
    tm.certifications
  FROM team_members tm
  JOIN profiles p ON tm.profile_id = p.id
  WHERE 
    -- Exact match
    p.company_name = company_name_input
    OR
    -- Company name starts with input
    p.company_name ILIKE company_name_input || '%'
    OR
    -- Input starts with company name
    company_name_input ILIKE p.company_name || '%'
    OR
    -- Strip common suffixes and compare
    REPLACE(REPLACE(REPLACE(p.company_name, ', SCR, S.A.', ''), ' SCR', ''), ', S.A.', '') 
      ILIKE REPLACE(REPLACE(REPLACE(company_name_input, ', SCR, S.A.', ''), ' SCR', ''), ', S.A.', '') || '%'
  ORDER BY tm.created_at ASC;
END;
$function$;