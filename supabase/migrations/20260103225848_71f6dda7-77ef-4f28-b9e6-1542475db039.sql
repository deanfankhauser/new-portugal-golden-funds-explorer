-- Create contact_submissions table for backup of contact form submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  
  -- Tracking fields
  user_agent text,
  referrer text,
  
  -- Email delivery status
  admin_email_sent boolean DEFAULT false,
  admin_email_sent_at timestamptz,
  user_email_sent boolean DEFAULT false,
  user_email_sent_at timestamptz,
  postmark_message_id text,
  error_message text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only admins can view submissions
CREATE POLICY "Admins can view all contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (is_user_admin());

-- Only admins can update submissions
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  USING (is_user_admin());

-- Allow inserts from edge function (service role bypasses RLS anyway)
-- This policy allows authenticated users to insert but the edge function uses service role
CREATE POLICY "Allow insert for contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Add index for admin queries
CREATE INDEX idx_contact_submissions_created_at 
  ON public.contact_submissions(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();