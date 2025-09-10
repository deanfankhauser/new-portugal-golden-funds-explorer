-- Create trigger to automatically create manager profiles when users sign up
CREATE TRIGGER on_auth_user_created_manager
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_manager_user();