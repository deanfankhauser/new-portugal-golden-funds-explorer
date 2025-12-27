-- Add YouTube video embed URL column to funds table
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS youtube_video_url text;