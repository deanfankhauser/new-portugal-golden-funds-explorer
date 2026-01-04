-- Remove STAG Fund Management from Emerald Green Fund
UPDATE funds 
SET manager_name = NULL 
WHERE id = 'emerald-green-fund';