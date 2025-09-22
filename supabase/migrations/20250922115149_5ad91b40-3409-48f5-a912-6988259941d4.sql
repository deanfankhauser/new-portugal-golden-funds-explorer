-- Create table for fund brief submissions pending approval
CREATE TABLE public.fund_brief_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id text NOT NULL,
  user_id uuid NOT NULL,
  brief_url text NOT NULL,
  brief_filename text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fund_brief_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can submit their own fund briefs" 
ON public.fund_brief_submissions 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions" 
ON public.fund_brief_submissions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" 
ON public.fund_brief_submissions 
FOR SELECT 
TO authenticated
USING (is_user_admin());

CREATE POLICY "Admins can update submissions" 
ON public.fund_brief_submissions 
FOR UPDATE 
TO authenticated
USING (is_user_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_fund_brief_submissions_updated_at
  BEFORE UPDATE ON public.fund_brief_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_fund_brief_submissions_fund_id ON public.fund_brief_submissions(fund_id);
CREATE INDEX idx_fund_brief_submissions_user_id ON public.fund_brief_submissions(user_id);
CREATE INDEX idx_fund_brief_submissions_status ON public.fund_brief_submissions(status);

-- Create storage bucket for pending fund briefs (separate from approved ones)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('fund-briefs-pending', 'fund-briefs-pending', false);

-- Storage policies for pending fund briefs
CREATE POLICY "Authenticated users can upload pending fund briefs" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'fund-briefs-pending');

CREATE POLICY "Users can view their pending uploads" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'fund-briefs-pending' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all pending fund briefs" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'fund-briefs-pending' AND is_user_admin());

CREATE POLICY "Admins can delete pending fund briefs" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'fund-briefs-pending' AND is_user_admin());