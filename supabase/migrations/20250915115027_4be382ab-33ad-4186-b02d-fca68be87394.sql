-- Enable real-time updates for the funds table
ALTER TABLE public.funds REPLICA IDENTITY FULL;

-- Add the funds table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.funds;