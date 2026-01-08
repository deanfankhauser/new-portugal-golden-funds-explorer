-- Add social media URL columns to funds table
ALTER TABLE public.funds
ADD COLUMN youtube_url text,
ADD COLUMN instagram_url text,
ADD COLUMN tiktok_url text,
ADD COLUMN facebook_url text,
ADD COLUMN twitter_url text;