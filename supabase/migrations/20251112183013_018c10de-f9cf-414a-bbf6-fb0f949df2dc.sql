-- Create page_performance_metrics table
CREATE TABLE IF NOT EXISTS public.page_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_type TEXT NOT NULL,
  lcp INTEGER,
  fcp INTEGER,
  cls NUMERIC,
  fid INTEGER,
  ttfb INTEGER,
  total_load_time INTEGER,
  session_id TEXT,
  user_id UUID,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_page_path ON public.page_performance_metrics(page_path);
CREATE INDEX IF NOT EXISTS idx_performance_page_type ON public.page_performance_metrics(page_type);
CREATE INDEX IF NOT EXISTS idx_performance_timestamp ON public.page_performance_metrics(timestamp);

-- Create page_errors table
CREATE TABLE IF NOT EXISTS public.page_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  page_path TEXT NOT NULL,
  error_message TEXT,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  user_id UUID,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for page errors
CREATE INDEX IF NOT EXISTS idx_errors_type ON public.page_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_errors_path ON public.page_errors(page_path);
CREATE INDEX IF NOT EXISTS idx_errors_timestamp ON public.page_errors(timestamp);

-- Enable RLS
ALTER TABLE public.page_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_errors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_performance_metrics
CREATE POLICY "Anyone can insert performance metrics"
  ON public.page_performance_metrics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all performance metrics"
  ON public.page_performance_metrics
  FOR SELECT
  USING (is_user_admin());

-- RLS Policies for page_errors
CREATE POLICY "Anyone can insert errors"
  ON public.page_errors
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all errors"
  ON public.page_errors
  FOR SELECT
  USING (is_user_admin());

-- Function to clean up old data (90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_performance_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.page_performance_metrics WHERE timestamp < now() - INTERVAL '90 days';
  DELETE FROM public.page_errors WHERE timestamp < now() - INTERVAL '90 days';
END;
$$;