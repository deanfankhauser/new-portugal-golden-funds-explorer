-- Drop old fund_managers-based policy
DROP POLICY IF EXISTS "Managers can view their fund analytics" ON fund_page_views;

-- Create new company-centric policy
CREATE POLICY "Managers can view company fund analytics" ON fund_page_views
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM funds
    WHERE funds.id = fund_page_views.fund_id
      AND can_user_manage_company_funds(auth.uid(), funds.manager_name)
  )
  OR is_user_admin()
);