-- Schedule weekly lead digest to run every Monday at 9 AM UTC
SELECT cron.schedule(
  'weekly-lead-digest',
  '0 9 * * 1',
  $$
  SELECT
    net.http_post(
        url:='https://bkmvydnfhmkjnuszroim.supabase.co/functions/v1/weekly-lead-digest',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);