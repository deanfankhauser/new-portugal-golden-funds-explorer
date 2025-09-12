-- Admin activity logging for audit trail
CREATE TABLE public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin activity policies
CREATE POLICY "Admins can view all activity logs" 
ON public.admin_activity_log 
FOR SELECT 
USING (is_user_admin());

CREATE POLICY "Admins can create activity logs" 
ON public.admin_activity_log 
FOR INSERT 
WITH CHECK (is_user_admin() AND auth.uid() = admin_user_id);

-- Function to log admin activities
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action_type TEXT,
  p_target_type TEXT,
  p_target_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_target_type,
    p_target_id,
    p_details
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;