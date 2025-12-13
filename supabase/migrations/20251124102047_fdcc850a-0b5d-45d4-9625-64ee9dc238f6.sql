-- Drop and recreate get_public_manager_profiles to include JSONB fields
DROP FUNCTION IF EXISTS public.get_public_manager_profiles();

CREATE FUNCTION public.get_public_manager_profiles()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  company_name text,
  manager_name text,
  description text,
  logo_url text,
  website text,
  city text,
  country text,
  founded_year integer,
  assets_under_management bigint,
  registration_number text,
  license_number text,
  manager_about text,
  manager_highlights jsonb,
  manager_faqs jsonb,
  team_members jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    p.id,
    p.user_id,
    p.company_name,
    p.manager_name,
    p.description,
    p.logo_url,
    p.website,
    p.city,
    p.country,
    p.founded_year,
    p.assets_under_management,
    p.registration_number,
    p.license_number,
    p.manager_about,
    p.manager_highlights,
    p.manager_faqs,
    p.team_members,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.company_name IS NOT NULL 
    AND p.manager_name IS NOT NULL;
$function$;