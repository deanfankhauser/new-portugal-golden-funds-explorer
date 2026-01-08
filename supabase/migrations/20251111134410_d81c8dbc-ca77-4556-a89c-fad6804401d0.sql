-- ============================================================
-- Stage 1: Company-Centric Permission System
-- ============================================================

-- Create security definer function to check if a user can manage company funds
CREATE OR REPLACE FUNCTION public.can_user_manage_company_funds(
  check_user_id uuid,
  check_manager_name text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Check if user has company-level assignment for this manager
  SELECT EXISTS (
    SELECT 1
    FROM public.manager_profile_assignments mpa
    JOIN public.profiles p ON p.id = mpa.profile_id
    WHERE mpa.user_id = check_user_id
      AND mpa.status = 'active'
      AND p.company_name = check_manager_name
  ) OR is_user_admin();
$$;

-- Update funds RLS policies to use company-centric permissions
DROP POLICY IF EXISTS "Assigned managers can update their funds" ON public.funds;

CREATE POLICY "Assigned managers can update their company funds"
ON public.funds
FOR UPDATE
USING (
  can_user_manage_company_funds(auth.uid(), manager_name)
);

-- Migrate existing fund_managers assignments to manager_profile_assignments
-- This creates company-level assignments for users who are currently assigned to specific funds
DO $$
DECLARE
  fund_assignment RECORD;
  matching_profile_id uuid;
  fund_data RECORD;
BEGIN
  -- Loop through all active fund_managers assignments
  FOR fund_assignment IN 
    SELECT DISTINCT fm.user_id, f.manager_name
    FROM fund_managers fm
    JOIN funds f ON f.id = fm.fund_id
    WHERE fm.status = 'active'
  LOOP
    -- Find matching company profile
    SELECT id INTO matching_profile_id
    FROM profiles
    WHERE company_name = fund_assignment.manager_name
    LIMIT 1;

    -- If matching profile exists, create company-level assignment
    IF matching_profile_id IS NOT NULL THEN
      INSERT INTO manager_profile_assignments (
        profile_id,
        user_id,
        status,
        permissions,
        notes,
        assigned_by
      )
      VALUES (
        matching_profile_id,
        fund_assignment.user_id,
        'active',
        jsonb_build_object(
          'can_edit_profile', true,
          'can_edit_funds', true,
          'can_manage_team', false,
          'can_view_analytics', true
        ),
        'Migrated from fund-level assignment',
        (SELECT user_id FROM admin_users WHERE role = 'super_admin' LIMIT 1)
      )
      ON CONFLICT (profile_id, user_id) DO NOTHING;
    END IF;
  END LOOP;
END $$;