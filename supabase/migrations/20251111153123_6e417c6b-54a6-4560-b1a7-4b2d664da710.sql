-- Create security definer function to check if user can view a profile
-- This bypasses RLS on manager_profile_assignments to avoid circular dependencies
CREATE OR REPLACE FUNCTION public.can_user_view_profile(_user_id uuid, _profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.manager_profile_assignments
    WHERE profile_id = _profile_id
      AND user_id = _user_id
      AND status = 'active'
  );
$$;

-- Drop the existing policy that uses EXISTS (which fails due to RLS on manager_profile_assignments)
DROP POLICY IF EXISTS "Users can view assigned company profiles" ON public.profiles;

-- Create new policy using the security definer function
CREATE POLICY "Users can view assigned company profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.can_user_view_profile(auth.uid(), id)
);