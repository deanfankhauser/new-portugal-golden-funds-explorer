-- Create a function to find user ID by email across all auth users
CREATE OR REPLACE FUNCTION public.find_user_by_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  found_user_id uuid;
BEGIN
  -- First try to find in manager profiles
  SELECT user_id INTO found_user_id
  FROM public.manager_profiles
  WHERE email = user_email
  LIMIT 1;
  
  -- If not found, try investor profiles
  IF found_user_id IS NULL THEN
    SELECT user_id INTO found_user_id
    FROM public.investor_profiles
    WHERE email = user_email
    LIMIT 1;
  END IF;
  
  -- If still not found, try to find in auth.users directly
  -- This requires service role privileges but is safe in SECURITY DEFINER
  IF found_user_id IS NULL THEN
    SELECT id INTO found_user_id
    FROM auth.users
    WHERE email = user_email
    LIMIT 1;
  END IF;
  
  RETURN found_user_id;
END;
$$;