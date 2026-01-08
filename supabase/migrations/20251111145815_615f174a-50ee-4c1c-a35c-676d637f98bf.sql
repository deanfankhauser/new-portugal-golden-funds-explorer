-- Create a function to match funds by company name, handling variations
CREATE OR REPLACE FUNCTION public.get_funds_by_company_name(company_name_param TEXT)
RETURNS TABLE(id TEXT, name TEXT)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Match funds where manager_name matches the company name
  -- Handle variations like "Lince Capital" vs "Lince Capital, SCR, S.A."
  -- by using ILIKE with pattern matching
  RETURN QUERY
  SELECT f.id, f.name
  FROM public.funds f
  WHERE 
    -- Exact match
    f.manager_name = company_name_param
    OR
    -- Company name is contained in manager_name
    f.manager_name ILIKE company_name_param || '%'
    OR
    -- Remove common suffixes and try again
    f.manager_name ILIKE REPLACE(REPLACE(company_name_param, ' SCR', ''), ', S.A.', '') || '%'
    OR
    -- Manager name stripped of suffixes matches company name
    REPLACE(REPLACE(REPLACE(f.manager_name, ', SCR, S.A.', ''), ' SCR', ''), ', S.A.', '') ILIKE company_name_param || '%'
  ORDER BY f.name;
END;
$$;