-- Create unified profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  
  -- Common fields
  phone text,
  address text,
  city text,
  country text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Manager-specific fields
  company_name text,
  manager_name text,
  website text,
  description text,
  registration_number text,
  license_number text,
  logo_url text,
  status manager_status,
  assets_under_management bigint,
  founded_year integer,
  approved_at timestamp with time zone,
  approved_by uuid,
  
  -- Investor-specific fields
  first_name text,
  last_name text,
  date_of_birth date,
  investment_experience text,
  risk_tolerance text,
  annual_income_range text,
  net_worth_range text,
  
  -- Constraints: must be either manager OR investor
  CONSTRAINT valid_profile_type CHECK (
    (company_name IS NOT NULL AND manager_name IS NOT NULL AND first_name IS NULL AND last_name IS NULL) OR
    (first_name IS NOT NULL AND last_name IS NOT NULL AND company_name IS NULL AND manager_name IS NULL)
  )
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Migrate data from manager_profiles
INSERT INTO public.profiles (
  user_id, email, phone, address, city, country, avatar_url, created_at, updated_at,
  company_name, manager_name, website, description, registration_number, license_number,
  logo_url, status, assets_under_management, founded_year, approved_at, approved_by
)
SELECT 
  user_id, email, phone, address, city, country, logo_url, created_at, updated_at,
  company_name, manager_name, website, description, registration_number, license_number,
  logo_url, status, assets_under_management, founded_year, approved_at, approved_by
FROM public.manager_profiles
ON CONFLICT (user_id) DO NOTHING;

-- Migrate data from investor_profiles
INSERT INTO public.profiles (
  user_id, email, phone, address, city, country, avatar_url, created_at, updated_at,
  first_name, last_name, date_of_birth, investment_experience, risk_tolerance,
  annual_income_range, net_worth_range
)
SELECT 
  user_id, email, phone, address, city, country, avatar_url, created_at, updated_at,
  first_name, last_name, date_of_birth, investment_experience, risk_tolerance,
  annual_income_range, net_worth_range
FROM public.investor_profiles
ON CONFLICT (user_id) DO NOTHING;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (is_user_admin());

CREATE POLICY "Super admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (get_user_admin_role() = 'super_admin'::admin_role);

CREATE POLICY "Super admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (get_user_admin_role() = 'super_admin'::admin_role);

-- Create or replace the unified user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  IF NOT NEW.email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format in user metadata';
  END IF;
  
  -- Create profile based on user type
  IF NEW.raw_user_meta_data ? 'is_manager' AND 
     (NEW.raw_user_meta_data ->> 'is_manager')::boolean = true THEN
    
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
      INSERT INTO public.profiles (
        user_id, email, company_name, manager_name, status, approved_at, approved_by
      ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'company_name'), ''),
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'manager_name'), ''),
        'approved'::manager_status,
        now(),
        NEW.id
      ) ON CONFLICT (email) DO NOTHING;
    END IF;
    
  ELSIF NEW.raw_user_meta_data ? 'is_investor' AND 
        (NEW.raw_user_meta_data ->> 'is_investor')::boolean = true THEN
    
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
      INSERT INTO public.profiles (
        user_id, email, first_name, last_name
      ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'first_name'), ''),
        COALESCE(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '')
      ) ON CONFLICT (email) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop old triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created_manager ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_investor ON auth.users;

-- Create unified trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update get_users_identity function to use profiles table
CREATE OR REPLACE FUNCTION public.get_users_identity(p_user_ids uuid[])
RETURNS TABLE(user_id uuid, email text, display_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN is_user_admin() THEN TRUE 
      ELSE (
        SELECT bool_and(u_id = auth.uid()) 
        FROM unnest(p_user_ids) AS u_id
      )
    END;
    
  SELECT
    p.user_id,
    p.email,
    COALESCE(
      NULLIF(TRIM(p.manager_name || ' (' || p.company_name || ')'), '()'),
      NULLIF(TRIM(p.first_name || ' ' || p.last_name), ''),
      split_part(p.email, '@', 1)
    ) AS display_name
  FROM public.profiles p
  WHERE p.user_id = ANY(p_user_ids)
    AND (is_user_admin() OR p.user_id = auth.uid());
$$;

-- Drop old tables (keep for now in case of rollback needs, comment these out if you want to keep them)
-- DROP TABLE IF EXISTS public.investor_profiles CASCADE;
-- DROP TABLE IF EXISTS public.manager_profiles CASCADE;