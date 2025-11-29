-- Add UPDATE policy for assigned managers to update company profiles
CREATE POLICY "Assigned managers can update company profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  public.can_user_edit_profile(auth.uid(), id)
);