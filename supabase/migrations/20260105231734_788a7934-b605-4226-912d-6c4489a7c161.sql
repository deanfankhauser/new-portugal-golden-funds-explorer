-- Add US persons eligibility tracking columns
ALTER TABLE public.funds 
ADD COLUMN IF NOT EXISTS accepts_us_persons_status TEXT DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS accepts_us_persons_source_url TEXT,
ADD COLUMN IF NOT EXISTS fatca_stated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fatca_source_url TEXT;

-- Add check constraint for valid status values
ALTER TABLE public.funds 
ADD CONSTRAINT funds_accepts_us_persons_status_check 
CHECK (accepts_us_persons_status IN ('confirmed_yes', 'confirmed_no', 'unknown'));

-- Migrate existing us_compliant=true funds to confirmed_yes status
UPDATE public.funds 
SET accepts_us_persons_status = 'confirmed_yes' 
WHERE us_compliant = true AND accepts_us_persons_status = 'unknown';

-- Add comment for documentation
COMMENT ON COLUMN public.funds.accepts_us_persons_status IS 'US persons eligibility: confirmed_yes, confirmed_no, or unknown';
COMMENT ON COLUMN public.funds.accepts_us_persons_source_url IS 'URL/reference to evidence of US person eligibility status';
COMMENT ON COLUMN public.funds.fatca_stated IS 'Whether FATCA compliance is stated by the fund';
COMMENT ON COLUMN public.funds.fatca_source_url IS 'URL/reference to FATCA compliance statement';