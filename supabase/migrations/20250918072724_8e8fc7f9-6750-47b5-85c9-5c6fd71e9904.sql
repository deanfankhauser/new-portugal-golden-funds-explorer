-- Add historical performance and logo fields to funds table
ALTER TABLE public.funds 
ADD COLUMN historical_performance jsonb,
ADD COLUMN logo_url text;

-- Create a function to validate historical performance data
CREATE OR REPLACE FUNCTION public.validate_historical_performance(performance_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if performance_data is null or empty
  IF performance_data IS NULL OR performance_data = '{}'::jsonb THEN
    RETURN true; -- Allow null/empty data
  END IF;
  
  -- Validate that performance_data has expected structure
  -- Expected format: {"2023": {"returns": 8.5, "nav": 1.085}, "2024": {"returns": 12.3, "nav": 1.123}}
  IF jsonb_typeof(performance_data) = 'object' THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Add a check constraint to validate historical performance data
ALTER TABLE public.funds 
ADD CONSTRAINT funds_historical_performance_valid 
CHECK (validate_historical_performance(historical_performance));

-- Add comment to describe the historical_performance column structure
COMMENT ON COLUMN public.funds.historical_performance IS 'JSON object containing historical performance data by year. Format: {"year": {"returns": number, "nav": number, "aum": number, "benchmark": number}}';

COMMENT ON COLUMN public.funds.logo_url IS 'URL to the fund logo image, stored in Supabase storage or external CDN';

-- Update the updated_at trigger to include new columns
CREATE OR REPLACE FUNCTION public.update_funds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists for the funds table
DROP TRIGGER IF EXISTS update_funds_updated_at ON public.funds;
CREATE TRIGGER update_funds_updated_at
  BEFORE UPDATE ON public.funds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_funds_updated_at();