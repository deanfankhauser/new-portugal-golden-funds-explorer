-- Add verification fields to funds table
ALTER TABLE public.funds 
  ADD COLUMN is_verified BOOLEAN DEFAULT false,
  ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN verified_by UUID REFERENCES auth.users(id);

-- Add index for performance when filtering verified funds
CREATE INDEX idx_funds_is_verified ON public.funds(is_verified) WHERE is_verified = true;

-- Add comment explaining admin-controlled verification
COMMENT ON COLUMN public.funds.is_verified IS 'Admin-controlled verification badge (manual)';