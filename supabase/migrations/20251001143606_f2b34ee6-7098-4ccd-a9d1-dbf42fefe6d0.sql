-- Remove all fund brief functionality from the database

-- Remove fund_brief_url column from funds table
ALTER TABLE public.funds DROP COLUMN IF EXISTS fund_brief_url;

-- Drop fund_brief_submissions table entirely
DROP TABLE IF EXISTS public.fund_brief_submissions CASCADE;

-- Remove storage buckets and policies for fund briefs
DELETE FROM storage.objects WHERE bucket_id IN ('fund-briefs', 'fund-briefs-pending');
DELETE FROM storage.buckets WHERE id IN ('fund-briefs', 'fund-briefs-pending');