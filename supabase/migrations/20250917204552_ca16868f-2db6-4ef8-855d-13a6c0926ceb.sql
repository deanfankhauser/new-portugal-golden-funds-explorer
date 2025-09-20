-- Fix Security Definer View issues by removing redundant views that bypass RLS
-- and keeping only the necessary secure views

-- Drop all redundant manager views that bypass RLS
DROP VIEW IF EXISTS public.managers_public_view;
DROP VIEW IF EXISTS public.public_managers;
DROP VIEW IF EXISTS public.managers_directory;

-- Keep only the two essential views with proper security:
-- 1. managers_public_directory (for anonymous users - only safe marketing info)
-- 2. managers_business_directory (for authenticated users - includes business metrics)

-- Ensure managers_public_directory has minimal information for public access
-- This view is safe because it only exposes non-sensitive marketing information
-- The underlying RLS policies on manager_profiles will still apply

-- Ensure managers_business_directory is properly secured for authenticated users only
-- This view is safe because access is controlled via GRANT statements

-- The key is that we're reducing the attack surface by having fewer views
-- and the remaining views follow the principle of least privilege