-- Enable admin DELETE on fund_brief_submissions
CREATE POLICY "Admins can delete submissions"
ON public.fund_brief_submissions
FOR DELETE
USING (public.is_user_admin());

-- Allow admins full access to fund brief files in both buckets  
CREATE POLICY "Admins full access to fund brief files"
ON storage.objects
FOR ALL
USING (public.is_user_admin() AND bucket_id IN ('fund-briefs','fund-briefs-pending'))
WITH CHECK (public.is_user_admin() AND bucket_id IN ('fund-briefs','fund-briefs-pending'));