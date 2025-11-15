-- Remove approval/status system from profiles table
-- This migration simplifies to single user type with auto-publish (no approval workflow)

-- Drop the status-related columns
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS approved_at,
DROP COLUMN IF EXISTS approved_by;

-- Drop functions related to manager approvals
DROP FUNCTION IF EXISTS public.get_pending_manager_profiles();
DROP FUNCTION IF EXISTS public.admin_approve_manager_profile(uuid, text);
DROP FUNCTION IF EXISTS public.admin_reject_manager_profile(uuid, text);

-- Drop and recreate get_public_manager_profiles without status
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
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
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
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.company_name IS NOT NULL 
    AND p.manager_name IS NOT NULL;
$$;

-- Update the handle_new_user trigger function to remove status logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Validate user data
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  IF NOT NEW.email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format in user metadata';
  END IF;
  
  -- Create unified profile for all users (no status/approval needed)
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
    INSERT INTO public.profiles (
      user_id,
      email,
      first_name,
      last_name
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(TRIM(NEW.raw_user_meta_data ->> 'first_name'), ''),
      COALESCE(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '')
    ) ON CONFLICT (email) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop the manager_status enum type if it exists
DROP TYPE IF EXISTS manager_status CASCADE;