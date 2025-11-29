-- Fix can_user_manage_company_funds to use fuzzy matching
-- This allows RLS policies to correctly match company names with variations

CREATE OR REPLACE FUNCTION public.can_user_manage_company_funds(check_user_id uuid, check_manager_name text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Check if user has company-level assignment for this manager
  -- Uses fuzzy matching to handle name variations like:
  -- "Lince Capital SCR" vs "Lince Capital, SCR, S.A."
  SELECT EXISTS (
    SELECT 1
    FROM public.manager_profile_assignments mpa
    JOIN public.profiles p ON p.id = mpa.profile_id
    WHERE mpa.user_id = check_user_id
      AND mpa.status = 'active'
      AND (
        -- Exact match
        p.company_name = check_manager_name
        OR
        -- Manager name starts with company name
        check_manager_name ILIKE p.company_name || '%'
        OR
        -- Strip common suffixes from company name and try
        check_manager_name ILIKE REPLACE(REPLACE(p.company_name, ' SCR', ''), ', S.A.', '') || '%'
        OR
        -- Strip suffixes from manager name and compare with company name
        REPLACE(REPLACE(REPLACE(check_manager_name, ', SCR, S.A.', ''), ' SCR', ''), ', S.A.', '') ILIKE p.company_name || '%'
      )
  ) OR is_user_admin();
$function$;

-- Add comment explaining the fix
COMMENT ON FUNCTION public.can_user_manage_company_funds IS 
'Checks if a user can manage funds for a company using fuzzy name matching to handle variations like "Company SCR" vs "Company, SCR, S.A."';