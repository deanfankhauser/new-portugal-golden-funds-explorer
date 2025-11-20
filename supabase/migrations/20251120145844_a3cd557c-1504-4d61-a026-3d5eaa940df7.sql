-- Step 1: Drop the broken policies from previous migration
DROP POLICY IF EXISTS "Admins can upload any profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update any profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete any profile photo" ON storage.objects;

-- Step 2: Grant execute permission on is_user_admin to authenticated users
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO authenticated;

-- Step 3: Create policies with explicit function call syntax
CREATE POLICY "Admins can upload any profile photo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND 
  (SELECT public.is_user_admin(auth.uid()))
);

CREATE POLICY "Admins can update any profile photo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND 
  (SELECT public.is_user_admin(auth.uid()))
);

CREATE POLICY "Admins can delete any profile photo"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND 
  (SELECT public.is_user_admin(auth.uid()))
);