-- Update the manager user creation trigger to automatically approve managers
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
        email,
        status,
        approved_at,
        approved_by
      ) VALUES (
        NEW.id,
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'company_name'), ''),
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'manager_name'), ''),
        NEW.email,
        'approved'::manager_status,  -- Auto-approve new managers
        now(),  -- Set approval timestamp
        NEW.id  -- Self-approved (or could be set to a system admin ID)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;