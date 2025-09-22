-- Update storage policies for fund briefs to allow all authenticated users to upload and delete

-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Admins can upload fund briefs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view fund briefs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update fund briefs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete fund briefs" ON storage.objects;

-- Create new policies allowing all authenticated users
CREATE POLICY "Authenticated users can upload fund briefs" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'fund-briefs');

CREATE POLICY "Authenticated users can view fund briefs" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'fund-briefs');

CREATE POLICY "Authenticated users can update fund briefs" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'fund-briefs');

CREATE POLICY "Authenticated users can delete fund briefs" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'fund-briefs');