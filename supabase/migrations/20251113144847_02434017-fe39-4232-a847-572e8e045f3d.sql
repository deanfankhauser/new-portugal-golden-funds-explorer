-- Remove test leads for Heed Capital
DELETE FROM public.fund_enquiries
WHERE fund_id IN (
  SELECT id FROM public.funds WHERE manager_name = 'Heed Capital'
);