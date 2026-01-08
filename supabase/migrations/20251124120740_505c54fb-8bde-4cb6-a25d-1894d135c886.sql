-- Add manager_name column to fund_enquiries table for general company enquiries
ALTER TABLE public.fund_enquiries 
ADD COLUMN manager_name TEXT NULL;

-- Create index for query performance
CREATE INDEX idx_fund_enquiries_manager_name ON public.fund_enquiries(manager_name);

-- Update RLS policies to support both fund-specific and general company enquiries
DROP POLICY IF EXISTS "Managers can view company fund enquiries" ON public.fund_enquiries;
DROP POLICY IF EXISTS "Managers can update company fund enquiries" ON public.fund_enquiries;

-- New SELECT policy supporting both fund-specific and general company enquiries
CREATE POLICY "Managers can view company enquiries"
ON public.fund_enquiries FOR SELECT
USING (
  -- Fund-specific enquiries (existing logic)
  (fund_id IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM funds
      WHERE funds.id = fund_enquiries.fund_id 
      AND can_user_manage_company_funds(auth.uid(), funds.manager_name)
    ) 
    OR is_user_admin()
  ))
  OR
  -- General company enquiries (new logic)
  (fund_id IS NULL AND manager_name IS NOT NULL 
   AND (can_user_manage_company_funds(auth.uid(), manager_name) OR is_user_admin()))
  OR
  -- Legacy general enquiries without manager_name (fallback for backwards compatibility)
  (fund_id IS NULL AND manager_name IS NULL AND (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN manager_profile_assignments mpa ON mpa.profile_id = p.id
      WHERE mpa.user_id = auth.uid() AND mpa.status = 'active'
    ) OR is_user_admin()
  ))
);

-- New UPDATE policy supporting both fund-specific and general company enquiries
CREATE POLICY "Managers can update company enquiries"
ON public.fund_enquiries FOR UPDATE
USING (
  -- Fund-specific enquiries (existing logic)
  (fund_id IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM funds
      WHERE funds.id = fund_enquiries.fund_id 
      AND can_user_manage_company_funds(auth.uid(), funds.manager_name)
    ) 
    OR is_user_admin()
  ))
  OR
  -- General company enquiries (new logic)
  (fund_id IS NULL AND manager_name IS NOT NULL 
   AND (can_user_manage_company_funds(auth.uid(), manager_name) OR is_user_admin()))
  OR
  -- Legacy general enquiries without manager_name (fallback for backwards compatibility)
  (fund_id IS NULL AND manager_name IS NULL AND (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN manager_profile_assignments mpa ON mpa.profile_id = p.id
      WHERE mpa.user_id = auth.uid() AND mpa.status = 'active'
    ) OR is_user_admin()
  ))
)
WITH CHECK (
  -- Fund-specific enquiries (existing logic)
  (fund_id IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM funds
      WHERE funds.id = fund_enquiries.fund_id 
      AND can_user_manage_company_funds(auth.uid(), funds.manager_name)
    ) 
    OR is_user_admin()
  ))
  OR
  -- General company enquiries (new logic)
  (fund_id IS NULL AND manager_name IS NOT NULL 
   AND (can_user_manage_company_funds(auth.uid(), manager_name) OR is_user_admin()))
  OR
  -- Legacy general enquiries without manager_name (fallback for backwards compatibility)
  (fund_id IS NULL AND manager_name IS NULL AND (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN manager_profile_assignments mpa ON mpa.profile_id = p.id
      WHERE mpa.user_id = auth.uid() AND mpa.status = 'active'
    ) OR is_user_admin()
  ))
);