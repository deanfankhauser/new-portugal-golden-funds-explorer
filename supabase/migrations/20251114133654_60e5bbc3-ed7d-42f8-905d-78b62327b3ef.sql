-- Deduplicate fund_page_views table
-- This removes duplicate page views from the same session for the same fund
-- Keeps only the earliest view per fund per session per hour

-- Step 1: Create a temporary table with deduplicated data
CREATE TEMP TABLE deduplicated_views AS
SELECT DISTINCT ON (fund_id, session_id, DATE_TRUNC('hour', viewed_at))
  id,
  fund_id,
  session_id,
  viewed_at,
  user_id,
  referrer,
  user_agent,
  created_at
FROM fund_page_views
ORDER BY fund_id, session_id, DATE_TRUNC('hour', viewed_at), viewed_at ASC;

-- Step 2: Log the number of duplicates that will be removed
DO $$
DECLARE
  total_count INTEGER;
  dedup_count INTEGER;
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM fund_page_views;
  SELECT COUNT(*) INTO dedup_count FROM deduplicated_views;
  duplicate_count := total_count - dedup_count;
  
  RAISE NOTICE 'Total page views before deduplication: %', total_count;
  RAISE NOTICE 'Unique page views after deduplication: %', dedup_count;
  RAISE NOTICE 'Duplicate page views to be removed: %', duplicate_count;
END $$;

-- Step 3: Delete all records from the original table
DELETE FROM fund_page_views;

-- Step 4: Insert the deduplicated records back
INSERT INTO fund_page_views (id, fund_id, session_id, viewed_at, user_id, referrer, user_agent, created_at)
SELECT id, fund_id, session_id, viewed_at, user_id, referrer, user_agent, created_at
FROM deduplicated_views;

-- Step 5: Add a comment to track this cleanup
COMMENT ON TABLE fund_page_views IS 'Deduplicated on 2025-11-14 to remove tracking bug duplicates. Kept earliest view per fund per session per hour.';

-- Step 6: Create indexes to help with future analytics queries (without DATE_TRUNC)
CREATE INDEX IF NOT EXISTS idx_fund_page_views_fund_viewed 
ON fund_page_views (fund_id, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_fund_page_views_session_fund 
ON fund_page_views (session_id, fund_id, viewed_at DESC);