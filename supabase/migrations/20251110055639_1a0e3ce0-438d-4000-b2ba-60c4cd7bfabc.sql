-- Create email_captures table
CREATE TABLE public.email_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text NOT NULL DEFAULT 'exit_intent',
  status text NOT NULL DEFAULT 'pending_confirmation' 
    CHECK (status IN ('pending_confirmation', 'confirmed', 'unsubscribed', 'bounced')),
  confirmation_token uuid UNIQUE DEFAULT gen_random_uuid(),
  confirmed_at timestamptz,
  user_agent text,
  referrer_url text,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_email_captures_email ON public.email_captures(email);
CREATE INDEX idx_email_captures_status ON public.email_captures(status);
CREATE INDEX idx_email_captures_token ON public.email_captures(confirmation_token);
CREATE INDEX idx_email_captures_created_at ON public.email_captures(created_at DESC);

-- Enable RLS
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT (for capturing emails)
CREATE POLICY "Allow anonymous insert for email capture"
  ON public.email_captures FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public to SELECT by token (for confirmation page)
CREATE POLICY "Allow select by confirmation token"
  ON public.email_captures FOR SELECT
  TO anon
  USING (confirmation_token IS NOT NULL);

-- Allow UPDATE only via confirmation token
CREATE POLICY "Allow update via confirmation token"
  ON public.email_captures FOR UPDATE
  TO anon
  USING (confirmation_token IS NOT NULL)
  WITH CHECK (status IN ('confirmed', 'unsubscribed'));

-- Admin full access (using existing admin_users table)
CREATE POLICY "Admin full access to email captures"
  ON public.email_captures FOR ALL
  TO authenticated
  USING (is_user_admin());

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER update_email_captures_updated_at
  BEFORE UPDATE ON public.email_captures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for admin dashboard
ALTER TABLE public.email_captures REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_captures;