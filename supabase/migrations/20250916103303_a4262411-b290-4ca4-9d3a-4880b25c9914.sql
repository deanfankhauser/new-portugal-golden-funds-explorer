-- Create custom types/enums
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'moderator');
CREATE TYPE public.manager_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.suggestion_status AS ENUM ('pending', 'approved', 'rejected');

-- Create manager_profiles table
CREATE TABLE public.manager_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  company_name text NOT NULL,
  manager_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  website text,
  description text,
  address text,
  city text,
  country text,
  registration_number text,
  license_number text,
  founded_year integer,
  logo_url text,
  assets_under_management bigint,
  status manager_status NOT NULL DEFAULT 'pending'::manager_status,
  approved_at timestamp with time zone,
  approved_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create investor_profiles table
CREATE TABLE public.investor_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  date_of_birth date,
  address text,
  city text,
  country text,
  investment_experience text,
  risk_tolerance text,
  annual_income_range text,
  net_worth_range text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create admin_users table
CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'moderator'::admin_role,
  granted_by uuid NOT NULL,
  granted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create fund_edit_suggestions table
CREATE TABLE public.fund_edit_suggestions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id text NOT NULL,
  user_id uuid NOT NULL,
  status suggestion_status NOT NULL DEFAULT 'pending'::suggestion_status,
  current_values jsonb NOT NULL,
  suggested_changes jsonb NOT NULL,
  approved_by uuid,
  approved_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create fund_edit_history table
CREATE TABLE public.fund_edit_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id text NOT NULL,
  suggestion_id uuid,
  changes jsonb NOT NULL,
  changed_by uuid NOT NULL,
  admin_user_id uuid NOT NULL,
  applied_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.manager_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_edit_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_edit_history ENABLE ROW LEVEL SECURITY;

-- Create database functions
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = check_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_admin_role(check_user_id uuid DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role 
  FROM public.admin_users 
  WHERE user_id = check_user_id;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_manager_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  IF NEW.raw_user_meta_data ? 'is_manager' AND 
     (NEW.raw_user_meta_data ->> 'is_manager')::boolean = true THEN
    
    IF NOT NEW.email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
      RAISE EXCEPTION 'Invalid email format in user metadata';
    END IF;
    
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
$$;

CREATE OR REPLACE FUNCTION public.handle_new_investor_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  IF NEW.raw_user_meta_data ? 'is_investor' AND 
     (NEW.raw_user_meta_data ->> 'is_investor')::boolean = true THEN
    
    IF NOT NEW.email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
      RAISE EXCEPTION 'Invalid email format in user metadata';
    END IF;
    
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
$$;

-- Create RLS policies for manager_profiles
CREATE POLICY "Managers can view own profile" 
ON public.manager_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Managers can create own profile" 
ON public.manager_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can update own profile" 
ON public.manager_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Public marketing info only - no contact details" 
ON public.manager_profiles 
FOR SELECT 
USING ((status = 'approved'::manager_status) AND (company_name IS NOT NULL) AND (manager_name IS NOT NULL));

CREATE POLICY "Authenticated users only for business data" 
ON public.manager_profiles 
FOR SELECT 
USING ((status = 'approved'::manager_status) AND (auth.uid() IS NOT NULL) AND (company_name IS NOT NULL) AND (manager_name IS NOT NULL));

-- Create RLS policies for investor_profiles
CREATE POLICY "Investors can view own profile" 
ON public.investor_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Investors can create own profile" 
ON public.investor_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Investors can update own profile" 
ON public.investor_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for admin_users
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (is_user_admin());

CREATE POLICY "Super admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (get_user_admin_role() = 'super_admin'::admin_role);

-- Create RLS policies for fund_edit_suggestions
CREATE POLICY "Users can view own suggestions" 
ON public.fund_edit_suggestions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create suggestions" 
ON public.fund_edit_suggestions 
FOR INSERT 
WITH CHECK ((auth.uid() = user_id) AND (auth.uid() IS NOT NULL));

CREATE POLICY "Admins can view all suggestions" 
ON public.fund_edit_suggestions 
FOR SELECT 
USING (is_user_admin());

CREATE POLICY "Admins can update suggestions" 
ON public.fund_edit_suggestions 
FOR UPDATE 
USING (is_user_admin());

CREATE POLICY "Users can delete own suggestions" 
ON public.fund_edit_suggestions 
FOR DELETE 
USING ((auth.uid() = user_id) AND (status = 'pending'::suggestion_status));

-- Create RLS policies for fund_edit_history
CREATE POLICY "Anyone can view fund edit history" 
ON public.fund_edit_history 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can create edit history" 
ON public.fund_edit_history 
FOR INSERT 
WITH CHECK (is_user_admin() AND (auth.uid() = admin_user_id));

-- Create update triggers
CREATE TRIGGER update_manager_profiles_updated_at
BEFORE UPDATE ON public.manager_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investor_profiles_updated_at
BEFORE UPDATE ON public.investor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fund_edit_suggestions_updated_at
BEFORE UPDATE ON public.fund_edit_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();