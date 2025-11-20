-- Replace 'Dividends' tag with 'Dividend paying' across all funds
UPDATE public.funds
SET tags = array_replace(tags, 'Dividends', 'Dividend paying')
WHERE 'Dividends' = ANY(tags);