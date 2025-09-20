-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.validate_historical_performance(performance_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update the trigger function with proper search path
CREATE OR REPLACE FUNCTION public.update_funds_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;