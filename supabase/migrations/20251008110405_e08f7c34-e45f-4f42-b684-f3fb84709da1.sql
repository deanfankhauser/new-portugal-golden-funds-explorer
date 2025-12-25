-- Create fund_rankings table for manual ranking management
CREATE TABLE public.fund_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id TEXT NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  manual_rank INTEGER NOT NULL,
  category_rank INTEGER,
  visibility_boost INTEGER DEFAULT 0,
  notes TEXT,
  last_modified_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(fund_id),
  CONSTRAINT rank_positive CHECK (manual_rank > 0),
  CONSTRAINT visibility_boost_range CHECK (visibility_boost >= 0 AND visibility_boost <= 100)
);

-- Add ranking columns to funds table
ALTER TABLE public.funds 
ADD COLUMN IF NOT EXISTS manual_rank INTEGER,
ADD COLUMN IF NOT EXISTS algo_rank INTEGER,
ADD COLUMN IF NOT EXISTS final_rank INTEGER;

-- Enable RLS on fund_rankings
ALTER TABLE public.fund_rankings ENABLE ROW LEVEL SECURITY;

-- Public can read rankings
CREATE POLICY "Public read access to rankings"
  ON public.fund_rankings FOR SELECT
  USING (true);

-- Only admins can insert rankings
CREATE POLICY "Admins can insert rankings"
  ON public.fund_rankings FOR INSERT
  WITH CHECK (is_user_admin());

-- Only admins can update rankings
CREATE POLICY "Admins can update rankings"
  ON public.fund_rankings FOR UPDATE
  USING (is_user_admin());

-- Only admins can delete rankings
CREATE POLICY "Admins can delete rankings"
  ON public.fund_rankings FOR DELETE
  USING (is_user_admin());

-- Audit trigger for fund_rankings
CREATE TRIGGER update_fund_rankings_timestamp
  BEFORE UPDATE ON public.fund_rankings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_fund_rankings_fund_id ON public.fund_rankings(fund_id);
CREATE INDEX idx_fund_rankings_manual_rank ON public.fund_rankings(manual_rank);
CREATE INDEX idx_funds_manual_rank ON public.funds(manual_rank);
CREATE INDEX idx_funds_final_rank ON public.funds(final_rank);