-- Create team invitations table for custom invitation tokens
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  inviter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invitation_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  personal_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  used_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  CONSTRAINT team_invitations_valid_expiry CHECK (expires_at > created_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON public.team_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON public.team_invitations(status);
CREATE INDEX IF NOT EXISTS idx_team_invitations_profile ON public.team_invitations(profile_id);

-- Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view invitations sent to their email"
  ON public.team_invitations
  FOR SELECT
  USING (
    email IN (
      SELECT email FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Company managers can create invitations"
  ON public.team_invitations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_id
        AND can_user_edit_profile(auth.uid(), p.id)
    )
  );

CREATE POLICY "Company managers can view their company invitations"
  ON public.team_invitations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_id
        AND can_user_edit_profile(auth.uid(), p.id)
    )
    OR is_user_admin()
  );

CREATE POLICY "Company managers can update their company invitations"
  ON public.team_invitations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_id
        AND can_user_edit_profile(auth.uid(), p.id)
    )
    OR is_user_admin()
  );

-- Function to mark expired invitations
CREATE OR REPLACE FUNCTION public.mark_expired_invitations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.team_invitations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < now();
END;
$$;