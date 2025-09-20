-- Create manager_profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.manager_profiles (
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

-- Create investor_profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.investor_profiles (
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

-- Create fund_edit_suggestions table (if not exists)
CREATE TABLE IF NOT EXISTS public.fund_edit_suggestions (
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

-- Create fund_edit_history table (if not exists)
CREATE TABLE IF NOT EXISTS public.fund_edit_history (
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
ALTER TABLE public.fund_edit_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_edit_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for manager_profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manager_profiles' AND policyname = 'Managers can view own profile') THEN
    CREATE POLICY "Managers can view own profile" 
    ON public.manager_profiles 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manager_profiles' AND policyname = 'Managers can create own profile') THEN
    CREATE POLICY "Managers can create own profile" 
    ON public.manager_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manager_profiles' AND policyname = 'Managers can update own profile') THEN
    CREATE POLICY "Managers can update own profile" 
    ON public.manager_profiles 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manager_profiles' AND policyname = 'Public marketing info only - no contact details') THEN
    CREATE POLICY "Public marketing info only - no contact details" 
    ON public.manager_profiles 
    FOR SELECT 
    USING ((status = 'approved'::manager_status) AND (company_name IS NOT NULL) AND (manager_name IS NOT NULL));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manager_profiles' AND policyname = 'Authenticated users only for business data') THEN
    CREATE POLICY "Authenticated users only for business data" 
    ON public.manager_profiles 
    FOR SELECT 
    USING ((status = 'approved'::manager_status) AND (auth.uid() IS NOT NULL) AND (company_name IS NOT NULL) AND (manager_name IS NOT NULL));
  END IF;
END $$;

-- Create RLS policies for investor_profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_profiles' AND policyname = 'Investors can view own profile') THEN
    CREATE POLICY "Investors can view own profile" 
    ON public.investor_profiles 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_profiles' AND policyname = 'Investors can create own profile') THEN
    CREATE POLICY "Investors can create own profile" 
    ON public.investor_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_profiles' AND policyname = 'Investors can update own profile') THEN
    CREATE POLICY "Investors can update own profile" 
    ON public.investor_profiles 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create RLS policies for fund_edit_suggestions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fund_edit_suggestions' AND policyname = 'Users can view own suggestions') THEN
    CREATE POLICY "Users can view own suggestions" 
    ON public.fund_edit_suggestions 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fund_edit_suggestions' AND policyname = 'Authenticated users can create suggestions') THEN
    CREATE POLICY "Authenticated users can create suggestions" 
    ON public.fund_edit_suggestions 
    FOR INSERT 
    WITH CHECK ((auth.uid() = user_id) AND (auth.uid() IS NOT NULL));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fund_edit_suggestions' AND policyname = 'Admins can view all suggestions') THEN
    CREATE POLICY "Admins can view all suggestions" 
    ON public.fund_edit_suggestions 
    FOR SELECT 
    USING (is_user_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fund_edit_suggestions' AND policyname = 'Admins can update suggestions') THEN
    CREATE POLICY "Admins can update suggestions" 
    ON public.fund_edit_suggestions 
    FOR UPDATE 
    USING (is_user_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fund_edit_suggestions' AND policyname = 'Users can delete own suggestions') THEN
    CREATE POLICY "Users can delete own suggestions" 
    ON public.fund_edit_suggestions 
    FOR DELETE 
    USING ((auth.uid() = user_id) AND (status = 'pending'::suggestion_status));
  END IF;
END $$;

-- Create RLS policies for fund_edit_history
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fund_edit_history' AND policyname = 'Anyone can view fund edit history') THEN
    CREATE POLICY "Anyone can view fund edit history" 
    ON public.fund_edit_history 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fund_edit_history' AND policyname = 'Admins can create edit history') THEN
    CREATE POLICY "Admins can create edit history" 
    ON public.fund_edit_history 
    FOR INSERT 
    WITH CHECK (is_user_admin() AND (auth.uid() = admin_user_id));
  END IF;
END $$;

-- Create update triggers (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_manager_profiles_updated_at') THEN
    CREATE TRIGGER update_manager_profiles_updated_at
    BEFORE UPDATE ON public.manager_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_investor_profiles_updated_at') THEN
    CREATE TRIGGER update_investor_profiles_updated_at
    BEFORE UPDATE ON public.investor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_fund_edit_suggestions_updated_at') THEN
    CREATE TRIGGER update_fund_edit_suggestions_updated_at
    BEFORE UPDATE ON public.fund_edit_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;