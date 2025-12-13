-- Phase 1: Add manager-level content fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS manager_about TEXT,
ADD COLUMN IF NOT EXISTS manager_faqs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS manager_highlights JSONB DEFAULT '[]'::jsonb;

-- Phase 2: Create manager profile assignments table
CREATE TABLE IF NOT EXISTS public.manager_profile_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  permissions JSONB DEFAULT '{"can_edit_profile": true, "can_edit_funds": false, "can_manage_team": false, "can_view_analytics": true}'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(profile_id, user_id)
);

-- Enable RLS on manager_profile_assignments
ALTER TABLE public.manager_profile_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for manager_profile_assignments
CREATE POLICY "Admins can manage all profile assignments"
ON public.manager_profile_assignments
FOR ALL
TO authenticated
USING (is_user_admin());

CREATE POLICY "Users can view their own profile assignments"
ON public.manager_profile_assignments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Phase 3: Create manager profile edits history table
CREATE TABLE IF NOT EXISTS public.manager_profile_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  manager_user_id UUID NOT NULL REFERENCES auth.users(id),
  edit_type TEXT NOT NULL,
  previous_values JSONB NOT NULL,
  changes JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on manager_profile_edits
ALTER TABLE public.manager_profile_edits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for manager_profile_edits
CREATE POLICY "Admins can view all profile edits"
ON public.manager_profile_edits
FOR SELECT
TO authenticated
USING (is_user_admin());

CREATE POLICY "Managers can view their own edits"
ON public.manager_profile_edits
FOR SELECT
TO authenticated
USING (auth.uid() = manager_user_id);

CREATE POLICY "System can insert edits"
ON public.manager_profile_edits
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = manager_user_id OR is_user_admin());

-- Phase 4: Create function to check if user can edit profile
CREATE OR REPLACE FUNCTION public.can_user_edit_profile(p_user_id UUID, p_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.manager_profile_assignments
    WHERE user_id = p_user_id
      AND profile_id = p_profile_id
      AND status = 'active'
  ) OR is_user_admin();
$$;

-- Phase 5: Create function to get pending manager profiles
CREATE OR REPLACE FUNCTION public.get_pending_manager_profiles()
RETURNS TABLE(
  id UUID,
  user_id UUID,
  email TEXT,
  company_name TEXT,
  manager_name TEXT,
  description TEXT,
  website TEXT,
  registration_number TEXT,
  license_number TEXT,
  logo_url TEXT,
  city TEXT,
  country TEXT,
  founded_year INTEGER,
  assets_under_management BIGINT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.email,
    p.company_name,
    p.manager_name,
    p.description,
    p.website,
    p.registration_number,
    p.license_number,
    p.logo_url,
    p.city,
    p.country,
    p.founded_year,
    p.assets_under_management,
    p.status::TEXT,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE is_user_admin()
    AND p.status::TEXT = 'pending'
    AND p.company_name IS NOT NULL 
    AND p.manager_name IS NOT NULL;
$$;

-- Phase 6: Create function for batch manager approval
CREATE OR REPLACE FUNCTION public.admin_approve_manager_profile(
  p_profile_id UUID,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_profile RECORD;
BEGIN
  -- Check admin access
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Get profile details
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = p_profile_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  -- Update profile status
  UPDATE public.profiles
  SET 
    status = 'approved'::manager_status,
    approved_by = auth.uid(),
    approved_at = now(),
    updated_at = now()
  WHERE id = p_profile_id;

  -- Log activity
  PERFORM log_admin_activity(
    'MANAGER_APPROVED',
    'manager_profile',
    p_profile_id::TEXT,
    jsonb_build_object(
      'company_name', v_profile.company_name,
      'manager_name', v_profile.manager_name,
      'email', v_profile.email,
      'notes', p_admin_notes
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'profile_id', p_profile_id,
    'email', v_profile.email,
    'manager_name', v_profile.manager_name,
    'company_name', v_profile.company_name
  );
END;
$$;

-- Phase 7: Create function for manager rejection
CREATE OR REPLACE FUNCTION public.admin_reject_manager_profile(
  p_profile_id UUID,
  p_rejection_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_profile RECORD;
BEGIN
  -- Check admin access
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Get profile details
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = p_profile_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  -- Update profile status
  UPDATE public.profiles
  SET 
    status = 'rejected'::manager_status,
    updated_at = now()
  WHERE id = p_profile_id;

  -- Log activity
  PERFORM log_admin_activity(
    'MANAGER_REJECTED',
    'manager_profile',
    p_profile_id::TEXT,
    jsonb_build_object(
      'company_name', v_profile.company_name,
      'manager_name', v_profile.manager_name,
      'email', v_profile.email,
      'rejection_reason', p_rejection_reason
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'profile_id', p_profile_id,
    'email', v_profile.email,
    'manager_name', v_profile.manager_name,
    'company_name', v_profile.company_name,
    'rejection_reason', p_rejection_reason
  );
END;
$$;

-- Phase 8: Create RPC for assigning managers to profiles
CREATE OR REPLACE FUNCTION public.admin_assign_profile_managers(
  _profile_id UUID,
  _manager_ids UUID[],
  _permissions JSONB DEFAULT '{"can_edit_profile": true, "can_edit_funds": false, "can_manage_team": false, "can_view_analytics": true}'::jsonb,
  _status TEXT DEFAULT 'active',
  _notes TEXT DEFAULT NULL
)
RETURNS TABLE(user_id UUID, inserted BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _actor UUID := auth.uid();
BEGIN
  -- Ensure only admins can call this
  IF NOT is_user_admin() THEN
    RAISE EXCEPTION 'Not authorized: Admin privileges required';
  END IF;

  -- Basic validation
  IF _profile_id IS NULL THEN
    RAISE EXCEPTION 'Invalid profile_id';
  END IF;

  IF _manager_ids IS NULL OR array_length(_manager_ids, 1) IS NULL OR array_length(_manager_ids, 1) = 0 THEN
    RAISE EXCEPTION 'No managers provided';
  END IF;

  RETURN QUERY
  WITH input_ids AS (
    SELECT DISTINCT u AS user_id
    FROM unnest(_manager_ids) AS u
    WHERE u IS NOT NULL
  ),
  inserted AS (
    INSERT INTO public.manager_profile_assignments (profile_id, user_id, assigned_by, status, permissions, notes)
    SELECT
      _profile_id,
      i.user_id,
      _actor,
      COALESCE(_status, 'active'),
      COALESCE(_permissions, '{"can_edit_profile": true, "can_edit_funds": false, "can_manage_team": false, "can_view_analytics": true}'::jsonb),
      _notes
    FROM input_ids i
    ON CONFLICT (profile_id, user_id) DO NOTHING
    RETURNING manager_profile_assignments.user_id
  )
  SELECT i.user_id, (ins.user_id IS NOT NULL) AS inserted
  FROM input_ids i
  LEFT JOIN inserted ins ON ins.user_id = i.user_id;
END;
$$;

-- Add update trigger for manager_profile_assignments
CREATE TRIGGER update_manager_profile_assignments_updated_at
BEFORE UPDATE ON public.manager_profile_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.manager_profile_assignments IS 'Assigns users to manage specific manager profiles with granular permissions';
COMMENT ON TABLE public.manager_profile_edits IS 'Audit trail of all changes made to manager profiles by assigned managers';
COMMENT ON FUNCTION public.can_user_edit_profile IS 'Checks if a user has permission to edit a specific manager profile';
COMMENT ON FUNCTION public.admin_approve_manager_profile IS 'Approves a pending manager profile and logs the action';
COMMENT ON FUNCTION public.admin_reject_manager_profile IS 'Rejects a pending manager profile with reason and logs the action';