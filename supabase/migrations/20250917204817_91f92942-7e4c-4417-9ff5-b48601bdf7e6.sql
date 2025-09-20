-- Create saved_funds table for users to save their favorite funds
CREATE TABLE public.saved_funds (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  fund_id text NOT NULL,
  saved_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Ensure a user can't save the same fund twice
  UNIQUE(user_id, fund_id)
);

-- Enable RLS
ALTER TABLE public.saved_funds ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved funds
CREATE POLICY "Users can view their own saved funds" 
ON public.saved_funds 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can save funds for themselves
CREATE POLICY "Users can save funds for themselves" 
ON public.saved_funds 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can remove their own saved funds
CREATE POLICY "Users can remove their own saved funds" 
ON public.saved_funds 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_saved_funds_updated_at
  BEFORE UPDATE ON public.saved_funds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();