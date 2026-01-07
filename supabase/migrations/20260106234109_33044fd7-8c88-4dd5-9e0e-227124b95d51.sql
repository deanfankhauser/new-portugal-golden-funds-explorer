CREATE OR REPLACE FUNCTION public.get_public_team_members(limit_input integer DEFAULT 100)
 RETURNS TABLE(id uuid, name text, role text, slug text, photo_url text, profile_id uuid, company_name text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT
    tm.id,
    tm.name,
    tm.role,
    tm.slug,
    tm.photo_url,
    tm.profile_id,
    p.company_name
  FROM public.team_members tm
  JOIN public.profiles p ON p.id = tm.profile_id
  WHERE p.company_name IS NOT NULL
  ORDER BY tm.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(limit_input, 100), 1), 500);
$$;