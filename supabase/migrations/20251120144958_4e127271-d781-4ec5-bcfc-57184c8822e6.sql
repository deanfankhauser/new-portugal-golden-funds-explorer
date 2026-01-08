-- Allow admins to upload profile photos to any folder
CREATE POLICY "Admins can upload any profile photo"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND 
  public.is_user_admin()
);

-- Allow admins to update any profile photo
CREATE POLICY "Admins can update any profile photo"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-photos' AND 
  public.is_user_admin()
);

-- Allow admins to delete any profile photo
CREATE POLICY "Admins can delete any profile photo"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-photos' AND 
  public.is_user_admin()
);