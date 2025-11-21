-- Create index for efficient stale lead queries
CREATE INDEX IF NOT EXISTS idx_fund_enquiries_status_updated 
ON fund_enquiries(status, updated_at);

-- Schedule weekly stale lead reminder (Every Monday at 9:00 AM UTC)
SELECT cron.schedule(
  'weekly-stale-lead-reminder',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://bkmvydnfhmkjnuszroim.supabase.co/functions/v1/weekly-stale-lead-reminder',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"}'::jsonb,
    body := '{"test_mode": false}'::jsonb
  ) as request_id;
  $$
);