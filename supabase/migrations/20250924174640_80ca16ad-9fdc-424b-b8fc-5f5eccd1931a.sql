-- Add unique constraints for email columns to fix auth signup errors
ALTER TABLE public.manager_profiles 
ADD CONSTRAINT manager_profiles_email_unique UNIQUE (email);

ALTER TABLE public.investor_profiles 
ADD CONSTRAINT investor_profiles_email_unique UNIQUE (email);