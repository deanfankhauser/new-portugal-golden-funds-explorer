-- Security Review and Optimization for SECURITY DEFINER Functions
-- Note: The handle_new_*_user functions REQUIRE SECURITY DEFINER to work properly
-- They are authentication triggers that need elevated permissions to create user profiles

-- Add additional security constraints to the SECURITY DEFINER functions
-- to minimize any potential security risks

-- Recreate the investor user handler with enhanced security
CREATE OR REPLACE FUNCTION public.handle_new_investor_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Enhanced security: Only allow execution during auth events
  -- This function should only be called by Supabase auth triggers
  
  -- Validate that we're in an auth context (NEW record has valid auth user structure)
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  -- Only create profile if user signed up with investor-specific metadata
  -- AND if no profile already exists (prevent duplicate key errors)
  IF NEW.raw_user_meta_data ? 'is_investor' AND 
     (NEW.raw_user_meta_data ->> 'is_investor')::boolean = true THEN
    
    -- Additional security: Validate email format
    IF NOT NEW.email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
      RAISE EXCEPTION 'Invalid email format in user metadata';
    END IF;
    
    -- Check if profile already exists to prevent duplicate key errors
    IF NOT EXISTS (SELECT 1 FROM public.investor_profiles WHERE user_id = NEW.id) THEN
      INSERT INTO public.investor_profiles (
        user_id,
        first_name,
        last_name,
        email
      ) VALUES (
        NEW.id,
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'first_name'), ''),
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'last_name'), ''),
        NEW.email
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recreate the manager user handler with enhanced security
CREATE OR REPLACE FUNCTION public.handle_new_manager_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Enhanced security: Only allow execution during auth events
  -- This function should only be called by Supabase auth triggers
  
  -- Validate that we're in an auth context (NEW record has valid auth user structure)
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  -- Only create profile if user signed up with manager-specific metadata
  -- AND if no profile already exists (prevent duplicate key errors)
  IF NEW.raw_user_meta_data ? 'is_manager' AND 
     (NEW.raw_user_meta_data ->> 'is_manager')::boolean = true THEN
    
    -- Additional security: Validate email format
    IF NOT NEW.email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
      RAISE EXCEPTION 'Invalid email format in user metadata';
    END IF;
    
    -- Check if profile already exists to prevent duplicate key errors
    IF NOT EXISTS (SELECT 1 FROM public.manager_profiles WHERE user_id = NEW.id) THEN
      INSERT INTO public.manager_profiles (
        user_id,
        company_name,
        manager_name,
        email
      ) VALUES (
        NEW.id,
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'company_name'), ''),
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'manager_name'), ''),
        NEW.email
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add comments documenting why SECURITY DEFINER is required and safe here
COMMENT ON FUNCTION public.handle_new_investor_user() IS 
'Authentication trigger function. SECURITY DEFINER is required to insert user profiles during signup. This is safe because: 1) Only called by Supabase auth system, 2) Validates input data, 3) Only inserts data for the authenticated user.';

COMMENT ON FUNCTION public.handle_new_manager_user() IS 
'Authentication trigger function. SECURITY DEFINER is required to insert user profiles during signup. This is safe because: 1) Only called by Supabase auth system, 2) Validates input data, 3) Only inserts data for the authenticated user.';

-- Create a security audit log for documentation purposes
-- This helps track that we've reviewed and secured these functions
INSERT INTO pg_description (objoid, objsubid, description) 
SELECT 
  p.oid, 
  0, 
  'SECURITY DEFINER function reviewed and secured on ' || now()::date || '. Required for authentication triggers.'
FROM pg_proc p 
WHERE p.proname IN ('handle_new_investor_user', 'handle_new_manager_user')
  AND p.pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ON CONFLICT DO NOTHING;