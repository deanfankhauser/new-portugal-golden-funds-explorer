-- Create tables for fund analytics tracking

-- Table for page views
CREATE TABLE IF NOT EXISTS public.fund_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id TEXT NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for fund interactions (clicks, additions to comparison, etc.)
CREATE TABLE IF NOT EXISTS public.fund_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id TEXT NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('comparison_add', 'booking_click', 'website_click', 'save_fund')),
  interacted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fund_page_views_fund_id ON public.fund_page_views(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_page_views_viewed_at ON public.fund_page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_fund_page_views_session_id ON public.fund_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_fund_interactions_fund_id ON public.fund_interactions(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_interactions_interacted_at ON public.fund_interactions(interacted_at);
CREATE INDEX IF NOT EXISTS idx_fund_interactions_type ON public.fund_interactions(interaction_type);

-- Enable RLS
ALTER TABLE public.fund_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fund_page_views

-- Anyone can insert page views (for tracking)
CREATE POLICY "Anyone can insert page views"
ON public.fund_page_views
FOR INSERT
TO public
WITH CHECK (true);

-- Managers can view analytics for their assigned funds
CREATE POLICY "Managers can view their fund analytics"
ON public.fund_page_views
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.fund_managers
    WHERE fund_managers.fund_id = fund_page_views.fund_id
    AND fund_managers.user_id = auth.uid()
    AND fund_managers.status = 'active'
  ) OR is_user_admin()
);

-- RLS Policies for fund_interactions

-- Anyone can insert interactions (for tracking)
CREATE POLICY "Anyone can insert interactions"
ON public.fund_interactions
FOR INSERT
TO public
WITH CHECK (true);

-- Managers can view interactions for their assigned funds
CREATE POLICY "Managers can view their fund interactions"
ON public.fund_interactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.fund_managers
    WHERE fund_managers.fund_id = fund_interactions.fund_id
    AND fund_managers.user_id = auth.uid()
    AND fund_managers.status = 'active'
  ) OR is_user_admin()
);