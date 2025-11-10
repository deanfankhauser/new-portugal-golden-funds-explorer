-- Drop obsolete functions that reference old table structures
DROP FUNCTION IF EXISTS public.get_all_investor_profiles_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_investor_profiles_for_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_investor_profiles_for_admin_secure() CASCADE;
DROP FUNCTION IF EXISTS public.get_masked_investor_data(investor_profiles, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_investor_profile_secure(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_investor_profile_stats() CASCADE;
DROP FUNCTION IF EXISTS public.log_and_allow_investor_profile_access(uuid) CASCADE;

-- Drop old tables (CASCADE automatically removes all RLS policies, indexes, and constraints)
DROP TABLE IF EXISTS public.investor_profiles CASCADE;
DROP TABLE IF EXISTS public.manager_profiles CASCADE;