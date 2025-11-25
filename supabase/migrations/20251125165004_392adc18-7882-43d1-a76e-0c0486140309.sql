-- Phase 1: Add missing columns to funds table for comprehensive data model

-- ISIN (International Securities Identification Number)
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS isin TEXT;

-- Typical ticket size (in EUR, complementing minimum_investment)
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS typical_ticket BIGINT;

-- AUM as-of date (per-fund instead of global constant)
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS aum_as_of_date DATE;

-- Track record: number of realised exits
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS realised_exits INTEGER DEFAULT 0;

-- Track record: total distributions paid to investors
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS total_distributions NUMERIC;

-- Last data review date (separate from verified_at)
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS last_data_review_date DATE;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_funds_isin ON public.funds(isin) WHERE isin IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_funds_aum_as_of_date ON public.funds(aum_as_of_date) WHERE aum_as_of_date IS NOT NULL;

COMMENT ON COLUMN public.funds.isin IS 'International Securities Identification Number';
COMMENT ON COLUMN public.funds.typical_ticket IS 'Typical investment ticket size in EUR';
COMMENT ON COLUMN public.funds.aum_as_of_date IS 'Date when AUM was last measured';
COMMENT ON COLUMN public.funds.realised_exits IS 'Number of realised exits from portfolio';
COMMENT ON COLUMN public.funds.total_distributions IS 'Total distributions paid to investors in EUR';
COMMENT ON COLUMN public.funds.last_data_review_date IS 'Date when fund data was last manually reviewed for accuracy';