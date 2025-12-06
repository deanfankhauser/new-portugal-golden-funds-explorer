-- Create fund_manager_email_logs table for tracking email engagement
CREATE TABLE fund_manager_email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Email identification
  postmark_message_id TEXT UNIQUE,
  email_type TEXT NOT NULL CHECK (email_type IN ('weekly_digest', 'monthly_performance_reminder')),
  
  -- Fund and recipient
  fund_id TEXT NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  manager_email TEXT NOT NULL,
  manager_name TEXT,
  
  -- Email content snapshot
  subject TEXT NOT NULL,
  is_verified_fund BOOLEAN NOT NULL DEFAULT false,
  
  -- Metrics (for weekly digest)
  weekly_impressions INTEGER,
  weekly_leads INTEGER,
  
  -- Engagement tracking
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  first_click_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  
  -- Metadata
  test_mode BOOLEAN DEFAULT false,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_fund_manager_email_logs_fund_id ON fund_manager_email_logs(fund_id);
CREATE INDEX idx_fund_manager_email_logs_manager_email ON fund_manager_email_logs(manager_email);
CREATE INDEX idx_fund_manager_email_logs_email_type ON fund_manager_email_logs(email_type);
CREATE INDEX idx_fund_manager_email_logs_sent_at ON fund_manager_email_logs(sent_at);
CREATE INDEX idx_fund_manager_email_logs_postmark_message_id ON fund_manager_email_logs(postmark_message_id);

-- RLS policies
ALTER TABLE fund_manager_email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can view all email logs"
  ON fund_manager_email_logs FOR SELECT
  TO authenticated
  USING (is_user_admin());

-- Trigger to update updated_at
CREATE TRIGGER update_fund_manager_email_logs_updated_at
  BEFORE UPDATE ON fund_manager_email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable pg_cron and pg_net extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Weekly digest: Every Monday at 9 AM UTC
SELECT cron.schedule(
  'weekly-fund-digest',
  '0 9 * * 1',
  $$
  SELECT
    net.http_post(
      url:='https://bkmvydnfhmkjnuszroim.supabase.co/functions/v1/weekly-fund-digest',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"}'::jsonb,
      body:='{"test_mode": false}'::jsonb
    ) as request_id;
  $$
);

-- Monthly performance reminder: 1st of each month at 10 AM UTC
SELECT cron.schedule(
  'monthly-performance-reminder',
  '0 10 1 * *',
  $$
  SELECT
    net.http_post(
      url:='https://bkmvydnfhmkjnuszroim.supabase.co/functions/v1/monthly-performance-reminder',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"}'::jsonb,
      body:='{"test_mode": false}'::jsonb
    ) as request_id;
  $$
);