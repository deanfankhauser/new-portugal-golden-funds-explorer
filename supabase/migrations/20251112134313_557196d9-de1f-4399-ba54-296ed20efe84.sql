-- Create table for storing additional email notification addresses for fund leads
CREATE TABLE IF NOT EXISTS public.fund_lead_notification_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id TEXT NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(fund_id, email)
);

-- Enable RLS
ALTER TABLE public.fund_lead_notification_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Managers can view notification emails for funds they manage
CREATE POLICY "Managers can view company fund notification emails" ON public.fund_lead_notification_emails
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.funds
    WHERE funds.id = fund_lead_notification_emails.fund_id
      AND can_user_manage_company_funds(auth.uid(), funds.manager_name)
  )
  OR is_user_admin()
);

-- Policy: Managers can insert notification emails for funds they manage
CREATE POLICY "Managers can insert company fund notification emails" ON public.fund_lead_notification_emails
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.funds
    WHERE funds.id = fund_lead_notification_emails.fund_id
      AND can_user_manage_company_funds(auth.uid(), funds.manager_name)
  )
  OR is_user_admin()
);

-- Policy: Managers can delete notification emails for funds they manage
CREATE POLICY "Managers can delete company fund notification emails" ON public.fund_lead_notification_emails
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.funds
    WHERE funds.id = fund_lead_notification_emails.fund_id
      AND can_user_manage_company_funds(auth.uid(), funds.manager_name)
  )
  OR is_user_admin()
);

-- Create index for faster lookups
CREATE INDEX idx_fund_lead_notification_emails_fund_id ON public.fund_lead_notification_emails(fund_id);