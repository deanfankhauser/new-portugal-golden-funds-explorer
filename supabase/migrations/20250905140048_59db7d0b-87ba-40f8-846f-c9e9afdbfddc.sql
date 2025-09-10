-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for manager status
CREATE TYPE public.manager_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');

-- Create manager profiles table
CREATE TABLE public.manager_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  registration_number TEXT,
  license_number TEXT,
  status manager_status NOT NULL DEFAULT 'pending',
  assets_under_management BIGINT,
  founded_year INTEGER,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on manager_profiles
ALTER TABLE public.manager_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for manager_profiles
-- Managers can view and update their own profile
CREATE POLICY "Managers can view own profile" 
ON public.manager_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Managers can update own profile" 
ON public.manager_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Managers can insert their own profile (for registration)
CREATE POLICY "Managers can create own profile" 
ON public.manager_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Public can view approved managers (for displaying on frontend)
CREATE POLICY "Public can view approved managers" 
ON public.manager_profiles 
FOR SELECT 
USING (status = 'approved');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_manager_profiles_updated_at
BEFORE UPDATE ON public.manager_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_manager_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if user signed up with manager-specific metadata
  IF NEW.raw_user_meta_data ? 'is_manager' AND 
     (NEW.raw_user_meta_data ->> 'is_manager')::boolean = true THEN
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_manager_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_manager_user();

-- Create indexes for better performance
CREATE INDEX idx_manager_profiles_user_id ON public.manager_profiles(user_id);
CREATE INDEX idx_manager_profiles_status ON public.manager_profiles(status);
CREATE INDEX idx_manager_profiles_company_name ON public.manager_profiles(company_name);

-- Create view for public manager data (what users can see)
CREATE VIEW public.public_managers AS
SELECT 
  id,
  company_name,
  manager_name,
  website,
  description,
  city,
  country,
  assets_under_management,
  founded_year,
  logo_url,
  created_at
FROM public.manager_profiles
WHERE status = 'approved';

-- Grant permissions on the view
GRANT SELECT ON public.public_managers TO anon, authenticated;