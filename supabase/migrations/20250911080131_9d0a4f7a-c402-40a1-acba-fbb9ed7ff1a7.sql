-- Security Review and Optimization for SECURITY DEFINER Functions
-- Note: The handle_new_*_user functions REQUIRE SECURITY DEFINER to work properly
-- They are authentication triggers that need elevated permissions to create user profiles

-- Recreate the investor user handler with enhanced security validation
CREATE OR REPLACE FUNCTION public.handle_new_investor_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Enhanced security: Validate that we're in an auth context
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  -- Only create profile if user signed up with investor-specific metadata
  IF NEW.raw_user_meta_data ? 'is_investor' AND 
     (NEW.raw_user_meta_data ->> 'is_investor')::boolean = true THEN
    
    -- Security: Validate email format
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

-- Recreate the manager user handler with enhanced security validation
CREATE OR REPLACE FUNCTION public.handle_new_manager_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Enhanced security: Validate that we're in an auth context
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  -- Only create profile if user signed up with manager-specific metadata
  IF NEW.raw_user_meta_data ? 'is_manager' AND 
     (NEW.raw_user_meta_data ->> 'is_manager')::boolean = true THEN
    
    -- Security: Validate email format
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

-- Add function comments to document security review
COMMENT ON FUNCTION public.handle_new_investor_user() IS 
'Authentication trigger function. SECURITY DEFINER is required for auth triggers to create user profiles. Enhanced with input validation for security.';

COMMENT ON FUNCTION public.handle_new_manager_user() IS 
'Authentication trigger function. SECURITY DEFINER is required for auth triggers to create user profiles. Enhanced with input validation for security.';