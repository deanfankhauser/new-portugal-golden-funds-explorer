-- Fix the manager profile creation trigger to handle existing profiles
CREATE OR REPLACE FUNCTION public.handle_new_manager_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create profile if user signed up with manager-specific metadata
  -- AND if no profile already exists
  IF NEW.raw_user_meta_data ? 'is_manager' AND 
     (NEW.raw_user_meta_data ->> 'is_manager')::boolean = true THEN
    
    -- Check if profile already exists to prevent duplicate key errors
    IF NOT EXISTS (SELECT 1 FROM public.manager_profiles WHERE user_id = NEW.id) THEN
      INSERT INTO public.manager_profiles (
        user_id,
        company_name,
        manager_name,
        email
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'company_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'manager_name', ''),
        NEW.email
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix the investor profile creation trigger to handle existing profiles
CREATE OR REPLACE FUNCTION public.handle_new_investor_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create profile if user signed up with investor-specific metadata
  -- AND if no profile already exists
  IF NEW.raw_user_meta_data ? 'is_investor' AND 
     (NEW.raw_user_meta_data ->> 'is_investor')::boolean = true THEN
    
    -- Check if profile already exists to prevent duplicate key errors
    IF NOT EXISTS (SELECT 1 FROM public.investor_profiles WHERE user_id = NEW.id) THEN
      INSERT INTO public.investor_profiles (
        user_id,
        first_name,
        last_name,
        email
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
        NEW.email
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;