-- Create storage bucket for fund briefs
INSERT INTO storage.buckets (id, name, public) VALUES ('fund-briefs', 'fund-briefs', false);

-- Create storage policies for fund briefs (admin only access)
CREATE POLICY "Admins can upload fund briefs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'fund-briefs' AND is_user_admin());

CREATE POLICY "Admins can view fund briefs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'fund-briefs' AND is_user_admin());

CREATE POLICY "Admins can update fund briefs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'fund-briefs' AND is_user_admin());

CREATE POLICY "Admins can delete fund briefs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'fund-briefs' AND is_user_admin());

-- Add fund_brief_url column to funds table
ALTER TABLE public.funds ADD COLUMN fund_brief_url text;