-- Create helper function to check if user can view profile assignments
CREATE OR REPLACE FUNCTION public.can_view_profile_assignments(_user uuid, _profile uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.manager_profile_assignments
    WHERE user_id = _user
      AND profile_id = _profile
      AND status = 'active'
  );
$$;

-- Add RLS policy to allow teammates to view each other's assignments
CREATE POLICY "Managers can view company profile assignments"
ON public.manager_profile_assignments
FOR SELECT
TO authenticated
USING (
  status = 'active'
  AND public.can_view_profile_assignments(auth.uid(), profile_id)
);