-- Create investor profiles table
CREATE TABLE public.investor_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  address text,
  city text,
  country text,
  investment_experience text CHECK (investment_experience IN ('beginner', 'intermediate', 'advanced', 'professional')),
  risk_tolerance text CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  annual_income_range text,
  net_worth_range text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for investor profiles
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

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Create storage policies for profile photos
CREATE POLICY "Users can view all profile photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photo" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile photo" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile photo" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to handle new investor user
CREATE OR REPLACE FUNCTION public.handle_new_investor_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create profile if user signed up with investor-specific metadata
  IF NEW.raw_user_meta_data ? 'is_investor' AND 
     (NEW.raw_user_meta_data ->> 'is_investor')::boolean = true THEN
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
  RETURN NEW;
END;
$$;

-- Create trigger for investor profiles
CREATE TRIGGER on_auth_user_created_investor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_investor_user();

-- Add trigger for updated_at on investor_profiles
CREATE TRIGGER update_investor_profiles_updated_at
BEFORE UPDATE ON public.investor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();