-- Delete the two recent test enquiries for heed-top-fund
DELETE FROM public.fund_enquiries 
WHERE id IN (
  'dfc29096-60b0-43eb-8d8d-d3c8ee898a0b',
  '5489be13-0425-4c62-ac6e-1fa78d51d736'
);
