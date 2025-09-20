-- Complete fix for Security Definer View issues
-- The core issue is that ALL views bypass RLS, making them security risks
-- The solution is to remove views entirely and rely on table-level RLS policies

-- Drop all remaining manager views that bypass RLS
DROP VIEW IF EXISTS public.managers_business_directory;
DROP VIEW IF EXISTS public.managers_business_info;  
DROP VIEW IF EXISTS public.managers_public_directory;

-- Drop security audit view that might be causing issues
DROP VIEW IF EXISTS public.security_status_audit;

-- Instead of views, we'll rely on the manager_profiles table with proper RLS policies
-- The existing RLS policies on manager_profiles already handle access control:
-- 1. "Public marketing info - no contact details" for public access
-- 2. "Authenticated users can see business info" for authenticated access
-- 3. "Managers can view own profile" for manager self-access
-- 4. "Admins can view all manager profiles" for admin access

-- Verify the RLS policies are working correctly
-- The frontend should query manager_profiles directly with appropriate WHERE clauses
-- instead of using views that bypass these security policies

-- This approach is more secure because:
-- 1. No views to bypass RLS
-- 2. All access controlled by table-level RLS policies
-- 3. Principle of least privilege enforced at the table level