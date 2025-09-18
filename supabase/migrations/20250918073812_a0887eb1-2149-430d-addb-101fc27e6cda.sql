-- Create fund-logos storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('fund-logos', 'fund-logos', true);

-- Create RLS policies for fund logos
CREATE POLICY "Fund logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'fund-logos');

CREATE POLICY "Admins can upload fund logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'fund-logos' AND is_user_admin());

CREATE POLICY "Admins can update fund logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'fund-logos' AND is_user_admin());

CREATE POLICY "Admins can delete fund logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'fund-logos' AND is_user_admin());