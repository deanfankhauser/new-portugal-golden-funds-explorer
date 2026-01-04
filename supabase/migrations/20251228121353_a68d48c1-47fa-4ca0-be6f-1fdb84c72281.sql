-- Create fund_submissions table for the "Submit Your Fund" feature
CREATE TABLE public.fund_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Company Info (all required except entity_type)
  company_name TEXT NOT NULL,
  company_description TEXT NOT NULL,
  company_website TEXT NOT NULL,
  company_city TEXT NOT NULL,
  company_country TEXT NOT NULL,
  company_logo_url TEXT NOT NULL,
  entity_type TEXT DEFAULT 'SCR',
  
  -- Contact/Team Member Info
  contact_name TEXT NOT NULL,
  contact_role TEXT NOT NULL,
  contact_bio TEXT,
  contact_photo_url TEXT,
  contact_linkedin TEXT,
  
  -- Fund Info (required fields)
  fund_name TEXT NOT NULL,
  fund_description TEXT NOT NULL,
  category TEXT NOT NULL,
  minimum_investment BIGINT NOT NULL,
  currency TEXT DEFAULT 'EUR',
  gv_eligible BOOLEAN NOT NULL DEFAULT false,
  
  -- Fees & Terms (all optional)
  management_fee NUMERIC,
  performance_fee NUMERIC,
  target_return_min NUMERIC,
  target_return_max NUMERIC,
  lock_up_period_months INTEGER,
  
  -- Regulatory (all optional)
  regulated_by TEXT,
  fund_location TEXT,
  cmvm_id TEXT,
  isin TEXT,
  
  -- Additional
  additional_notes TEXT,
  
  -- Workflow
  status TEXT NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  
  -- References to created entities (populated on approval)
  created_profile_id UUID,
  created_fund_id TEXT,
  created_team_member_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fund_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON public.fund_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Users must be logged in to submit (insert)
CREATE POLICY "Authenticated users can submit"
ON public.fund_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Users can update their own pending submissions
CREATE POLICY "Users can update own pending submissions"
ON public.fund_submissions
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
ON public.fund_submissions
FOR SELECT
USING (is_user_admin());

-- Admins can update any submission (for approval/rejection)
CREATE POLICY "Admins can update submissions"
ON public.fund_submissions
FOR UPDATE
USING (is_user_admin());

-- Admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.fund_submissions
FOR DELETE
USING (is_user_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_fund_submissions_updated_at
BEFORE UPDATE ON public.fund_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_fund_submissions_status ON public.fund_submissions(status);
CREATE INDEX idx_fund_submissions_user_id ON public.fund_submissions(user_id);
CREATE INDEX idx_fund_submissions_created_at ON public.fund_submissions(created_at DESC);