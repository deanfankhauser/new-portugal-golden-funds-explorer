-- Create quiz_analytics table to track quiz engagement
CREATE TABLE IF NOT EXISTS public.quiz_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'started', 'completed', 'shared', 'abandoned'
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  answers JSONB, -- Store quiz answers for completed events
  results_count INTEGER, -- Number of matching funds
  abandoned_at_step INTEGER, -- Which question they abandoned at
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics (anonymous tracking)
CREATE POLICY "Anyone can insert quiz analytics"
  ON public.quiz_analytics
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view all quiz analytics"
  ON public.quiz_analytics
  FOR SELECT
  USING (is_user_admin());

-- Create index for performance
CREATE INDEX idx_quiz_analytics_event_type ON public.quiz_analytics(event_type);
CREATE INDEX idx_quiz_analytics_created_at ON public.quiz_analytics(created_at DESC);
CREATE INDEX idx_quiz_analytics_session_id ON public.quiz_analytics(session_id);