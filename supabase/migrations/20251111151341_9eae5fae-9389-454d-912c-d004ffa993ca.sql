-- Add RLS policy to allow users to view profiles they're assigned to manage
CREATE POLICY "Users can view assigned company profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.manager_profile_assignments
    WHERE profile_id = profiles.id
      AND user_id = auth.uid()
      AND status = 'active'
  )
);