# Email Campaign Monitoring Queries

This document contains SQL queries for monitoring email campaign performance. These queries can be run directly in Supabase SQL Editor or used for custom reporting.

## Overall Email Campaign Stats (Last 30 Days)

```sql
SELECT 
  email_type,
  COUNT(*) as total_sent,
  COUNT(opened_at) as total_opened,
  COUNT(first_click_at) as total_clicked,
  ROUND(COUNT(opened_at)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as open_rate,
  ROUND(COUNT(first_click_at)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as click_rate,
  AVG(click_count) as avg_clicks_per_email
FROM fund_manager_email_logs
WHERE sent_at >= NOW() - INTERVAL '30 days'
  AND test_mode = false
GROUP BY email_type
ORDER BY email_type;
```

## Daily Email Performance Trend (Last 7 Days)

```sql
SELECT 
  DATE(sent_at) as send_date,
  email_type,
  COUNT(*) as sent,
  COUNT(opened_at) as opened,
  COUNT(first_click_at) as clicked,
  ROUND(COUNT(opened_at)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as open_rate
FROM fund_manager_email_logs
WHERE sent_at >= NOW() - INTERVAL '7 days'
  AND test_mode = false
GROUP BY DATE(sent_at), email_type
ORDER BY send_date DESC, email_type;
```

## Top Performing Funds by Email Engagement

```sql
SELECT 
  f.name as fund_name,
  f.manager_name,
  COUNT(DISTINCT e.id) as emails_sent,
  COUNT(e.opened_at) as emails_opened,
  COUNT(e.first_click_at) as emails_clicked,
  ROUND(COUNT(e.opened_at)::numeric / NULLIF(COUNT(DISTINCT e.id), 0)::numeric * 100, 2) as open_rate,
  ROUND(COUNT(e.first_click_at)::numeric / NULLIF(COUNT(DISTINCT e.id), 0)::numeric * 100, 2) as click_rate
FROM fund_manager_email_logs e
JOIN funds f ON f.id = e.fund_id
WHERE e.sent_at >= NOW() - INTERVAL '30 days'
  AND e.test_mode = false
GROUP BY f.id, f.name, f.manager_name
HAVING COUNT(DISTINCT e.id) >= 2
ORDER BY open_rate DESC
LIMIT 10;
```

## Manager Engagement Leaderboard

```sql
SELECT 
  manager_email,
  manager_name,
  COUNT(*) as total_emails,
  COUNT(opened_at) as opened,
  COUNT(first_click_at) as clicked,
  ROUND(COUNT(opened_at)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as open_rate,
  MAX(opened_at) as last_opened,
  SUM(click_count) as total_clicks
FROM fund_manager_email_logs
WHERE sent_at >= NOW() - INTERVAL '30 days'
  AND test_mode = false
GROUP BY manager_email, manager_name
ORDER BY open_rate DESC, total_clicks DESC
LIMIT 20;
```

## Verified vs Unverified Fund Performance Comparison

```sql
SELECT 
  CASE WHEN is_verified_fund THEN 'Verified' ELSE 'Unverified' END as fund_status,
  COUNT(*) as emails_sent,
  COUNT(opened_at) as opened,
  COUNT(first_click_at) as clicked,
  ROUND(COUNT(opened_at)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as open_rate,
  ROUND(COUNT(first_click_at)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) as click_rate
FROM fund_manager_email_logs
WHERE sent_at >= NOW() - INTERVAL '30 days'
  AND test_mode = false
GROUP BY is_verified_fund;
```

## Recent Email Activity (Last 50 Emails)

```sql
SELECT 
  e.sent_at,
  e.email_type,
  f.name as fund_name,
  e.manager_name,
  e.manager_email,
  e.subject,
  e.is_verified_fund,
  e.opened_at,
  e.first_click_at,
  e.click_count,
  e.weekly_impressions,
  e.weekly_leads
FROM fund_manager_email_logs e
JOIN funds f ON f.id = e.fund_id
WHERE e.test_mode = false
ORDER BY e.sent_at DESC
LIMIT 50;
```

## Time-to-Open Analysis

```sql
SELECT 
  email_type,
  AVG(EXTRACT(EPOCH FROM (opened_at - sent_at)) / 3600) as avg_hours_to_open,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (opened_at - sent_at)) / 3600) as median_hours_to_open
FROM fund_manager_email_logs
WHERE opened_at IS NOT NULL
  AND test_mode = false
  AND sent_at >= NOW() - INTERVAL '30 days'
GROUP BY email_type;
```

## Email Delivery Errors

```sql
SELECT 
  e.sent_at,
  e.email_type,
  f.name as fund_name,
  e.manager_email,
  e.error_message
FROM fund_manager_email_logs e
JOIN funds f ON f.id = e.fund_id
WHERE e.error_message IS NOT NULL
  AND e.sent_at >= NOW() - INTERVAL '7 days'
ORDER BY e.sent_at DESC;
```

## Notes

- All queries exclude test mode emails (`test_mode = false`)
- Time windows can be adjusted by modifying the `INTERVAL` values
- Open rate = (emails opened / emails sent) × 100
- Click rate = (emails clicked / emails sent) × 100
- Most queries use last 30 days for performance analysis
