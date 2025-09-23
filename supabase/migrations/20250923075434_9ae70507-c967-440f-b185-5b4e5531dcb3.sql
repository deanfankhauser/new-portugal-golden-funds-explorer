-- Ensure the handle_new_manager_user function exists and handles duplicates properly
CREATE OR REPLACE FUNCTION public.handle_new_manager_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public 
AS $$
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
      ) ON CONFLICT (email) DO NOTHING;  -- Handle duplicate emails gracefully
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ensure the handle_new_investor_user function exists and handles duplicates properly  
CREATE OR REPLACE FUNCTION public.handle_new_investor_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public 
AS $$
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
      ) ON CONFLICT (email) DO NOTHING;  -- Handle duplicate emails gracefully
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers to automatically handle new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created_manager ON auth.users;
CREATE TRIGGER on_auth_user_created_manager
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_manager_user();

DROP TRIGGER IF EXISTS on_auth_user_created_investor ON auth.users;
CREATE TRIGGER on_auth_user_created_investor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_investor_user();