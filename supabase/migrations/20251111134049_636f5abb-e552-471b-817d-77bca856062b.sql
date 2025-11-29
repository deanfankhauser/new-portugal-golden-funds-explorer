
-- Standardize fund manager names to match company profiles
-- This ensures funds.manager_name exactly matches profiles.company_name for clean relationships

UPDATE funds SET manager_name = 'Oxy Capital' 
WHERE manager_name = 'Oxy Capital – SGOIC, S.A.';

UPDATE funds SET manager_name = 'STAG Fund Management' 
WHERE manager_name = 'STAG Fund Management SCR, S.A.';

UPDATE funds SET manager_name = '3 Comma Capital' 
WHERE manager_name = '3 Comma Capital SCR, S.A.';

UPDATE funds SET manager_name = 'Heed Capital' 
WHERE manager_name = 'Heed Capital SGOIC, S.A.';

UPDATE funds SET manager_name = 'Pela Terra' 
WHERE manager_name = 'Pela Terra Capital SGOIC, S.A.';

UPDATE funds SET manager_name = 'Saratoga Capital' 
WHERE manager_name = 'Saratoga Capital Partners';

UPDATE funds SET manager_name = 'Ventures.EU, SCR, SA' 
WHERE manager_name = 'Ventures.EU, SCR, SA.';
