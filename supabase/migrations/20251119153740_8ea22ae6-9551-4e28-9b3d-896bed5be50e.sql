-- Reassign funds to new categories

-- Reassign to 'Crypto'
UPDATE public.funds 
SET category = 'Crypto'
WHERE id IN ('horizon-fund', '3cc-golden-income');

-- Reassign to 'Debt'  
UPDATE public.funds
SET category = 'Debt'
WHERE id IN ('lince-yield-fund', 'imga-portuguese-corporate-debt-fund');

-- Reassign to 'Clean Energy'
UPDATE public.funds
SET category = 'Clean Energy'
WHERE id = 'solar-future-fund';

-- Reassign to 'Private Equity'
UPDATE public.funds
SET category = 'Private Equity'
WHERE id = 'mercurio-fund-ii';

-- Reassign to 'Other'
UPDATE public.funds
SET category = 'Other'
WHERE id IN (
  'steady-growth-investment',
  'heed-top-fund', 
  'optimize-golden-opportunities',
  'portugal-liquid-opportunities',
  'imga-acoes-portugal-fund'
);