-- Add investment range tags to all funds based on minimum_investment

-- €100k-€250k range
UPDATE public.funds
SET tags = array_append(tags, 'Min. subscription €100k–250k')
WHERE minimum_investment >= 100000 
  AND minimum_investment < 250000
  AND NOT ('Min. subscription €100k–250k' = ANY(tags))
  AND NOT ('Min. subscription €250k–€350k' = ANY(tags))
  AND NOT ('Min. subscription €350k–€500k' = ANY(tags))
  AND NOT ('Min. subscription €500k+' = ANY(tags));

-- €250k-€350k range
UPDATE public.funds
SET tags = array_append(tags, 'Min. subscription €250k–€350k')
WHERE minimum_investment >= 250000 
  AND minimum_investment < 350000
  AND NOT ('Min. subscription €100k–250k' = ANY(tags))
  AND NOT ('Min. subscription €250k–€350k' = ANY(tags))
  AND NOT ('Min. subscription €350k–€500k' = ANY(tags))
  AND NOT ('Min. subscription €500k+' = ANY(tags));

-- €350k-€500k range
UPDATE public.funds
SET tags = array_append(tags, 'Min. subscription €350k–€500k')
WHERE minimum_investment >= 350000 
  AND minimum_investment < 500000
  AND NOT ('Min. subscription €100k–250k' = ANY(tags))
  AND NOT ('Min. subscription €250k–€350k' = ANY(tags))
  AND NOT ('Min. subscription €350k–€500k' = ANY(tags))
  AND NOT ('Min. subscription €500k+' = ANY(tags));

-- €500k+ range
UPDATE public.funds
SET tags = array_append(tags, 'Min. subscription €500k+')
WHERE minimum_investment >= 500000
  AND NOT ('Min. subscription €100k–250k' = ANY(tags))
  AND NOT ('Min. subscription €250k–€350k' = ANY(tags))
  AND NOT ('Min. subscription €350k–€500k' = ANY(tags))
  AND NOT ('Min. subscription €500k+' = ANY(tags));