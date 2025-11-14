-- Create RPC function to get email campaign stats efficiently
CREATE OR REPLACE FUNCTION public.get_email_campaign_stats(days INTEGER DEFAULT 30)
RETURNS TABLE (
  email_type TEXT,
  total_sent BIGINT,
  total_opened BIGINT,
  total_clicked BIGINT,
  open_rate NUMERIC,
  click_rate NUMERIC,
  avg_clicks_per_email NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    email_type,
    COUNT(*) as total_sent,
    COUNT(opened_at) as total_opened,
    COUNT(first_click_at) as total_clicked,
    ROUND(COUNT(opened_at)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as open_rate,
    ROUND(COUNT(first_click_at)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as click_rate,
    AVG(click_count) as avg_clicks_per_email
  FROM public.fund_manager_email_logs
  WHERE sent_at >= NOW() - (days || ' days')::INTERVAL
    AND test_mode = false
  GROUP BY email_type
  ORDER BY email_type;
$$;