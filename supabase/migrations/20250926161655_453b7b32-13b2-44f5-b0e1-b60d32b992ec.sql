-- Remove logo_url column from funds table
ALTER TABLE public.funds DROP COLUMN IF EXISTS logo_url;

-- Delete the fund-logos storage bucket and all its contents
DELETE FROM storage.objects WHERE bucket_id = 'fund-logos';
DELETE FROM storage.buckets WHERE id = 'fund-logos';