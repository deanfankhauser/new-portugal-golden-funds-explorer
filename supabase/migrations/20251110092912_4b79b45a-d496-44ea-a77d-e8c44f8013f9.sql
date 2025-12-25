-- Drop obsolete authentication triggers that reference deleted tables
DROP TRIGGER IF EXISTS on_auth_manager_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_investor_user_created ON auth.users;

-- Drop obsolete functions that reference deleted tables
DROP FUNCTION IF EXISTS public.handle_new_manager_user();
DROP FUNCTION IF EXISTS public.handle_new_investor_user();

-- Verify the correct trigger remains active
-- on_auth_user_created trigger (calling handle_new_user) should remain and handle all new user profile creation