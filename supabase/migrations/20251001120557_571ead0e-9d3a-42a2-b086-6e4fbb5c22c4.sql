-- Clean up conflicting storage policies for fund-briefs-pending bucket
-- Remove old policies and create a single clear policy for authenticated users

-- Drop existing potentially conflicting policies
DROP POLICY IF EXISTS "Authenticated users can upload fund briefs" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to own folder in pending briefs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to fund-briefs-pending" ON storage.objects;

-- Create a single, clear upload policy for fund-briefs-pending bucket
CREATE POLICY "Authenticated users can upload fund briefs to pending bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'fund-briefs-pending' 
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- Allow users to read their own uploaded files in pending bucket
CREATE POLICY "Users can read their own pending fund briefs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'fund-briefs-pending'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- Allow admins to read all files in pending bucket for review
CREATE POLICY "Admins can read all pending fund briefs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'fund-briefs-pending'
  AND is_user_admin()
);