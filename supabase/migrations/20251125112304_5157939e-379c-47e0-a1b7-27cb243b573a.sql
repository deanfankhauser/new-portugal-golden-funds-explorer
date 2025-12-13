-- Fix BiG Capital SGOIC data inconsistency
-- This standardizes the manager name to prevent duplicate entries on the managers page

UPDATE funds 
SET manager_name = 'BiG Capital SGOIC'
WHERE manager_name = 'Biz Capital SGOIC';