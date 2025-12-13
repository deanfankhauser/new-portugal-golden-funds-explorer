-- Update RLS policies on fund_enquiries to use company-centric permissions

-- Drop outdated policies relying on fund_managers
DROP POLICY IF EXISTS "Managers can view their fund enquiries" ON public.fund_enquiries;
DROP POLICY IF EXISTS "Managers can update their fund enquiries" ON public.fund_enquiries;

-- Create company-centric SELECT policy
CREATE POLICY "Managers can view company fund enquiries"
ON public.fund_enquiries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.funds
    WHERE public.funds.id = public.fund_enquiries.fund_id
      AND public.can_user_manage_company_funds(auth.uid(), public.funds.manager_name)
  )
  OR public.is_user_admin()
);

-- Create company-centric UPDATE policy
CREATE POLICY "Managers can update company fund enquiries"
ON public.fund_enquiries
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.funds
    WHERE public.funds.id = public.fund_enquiries.fund_id
      AND public.can_user_manage_company_funds(auth.uid(), public.funds.manager_name)
  )
  OR public.is_user_admin()
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.funds
    WHERE public.funds.id = public.fund_enquiries.fund_id
      AND public.can_user_manage_company_funds(auth.uid(), public.funds.manager_name)
  )
  OR public.is_user_admin()
);
