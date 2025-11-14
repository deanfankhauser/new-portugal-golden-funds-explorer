-- Create function to check if two users are teammates
CREATE OR REPLACE FUNCTION public.are_teammates(user_id_1 uuid, user_id_2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Check if both users are assigned to at least one common company profile
  SELECT EXISTS (
    SELECT 1
    FROM public.manager_profile_assignments mpa1
    JOIN public.manager_profile_assignments mpa2 
      ON mpa1.profile_id = mpa2.profile_id
    WHERE mpa1.user_id = user_id_1
      AND mpa2.user_id = user_id_2
      AND mpa1.status = 'active'
      AND mpa2.status = 'active'
  );
$$;

-- Add RLS policy to allow teammates to view each other's profiles
CREATE POLICY "Team members can view teammate profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  are_teammates(auth.uid(), user_id)
);