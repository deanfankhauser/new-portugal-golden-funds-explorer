-- Add news RSS feed URL column to funds table
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS news_rss_feed_url text;

-- Add a comment for documentation
COMMENT ON COLUMN public.funds.news_rss_feed_url IS 'URL to an RSS/Atom feed for displaying news articles on the fund profile page';