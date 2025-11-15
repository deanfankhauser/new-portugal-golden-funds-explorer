-- Ensure is_user_admin() function has correct grants
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO anon, authenticated;

-- Verify get_fund_manager_sign_ins() function permissions
GRANT EXECUTE ON FUNCTION public.get_fund_manager_sign_ins() TO anon, authenticated;