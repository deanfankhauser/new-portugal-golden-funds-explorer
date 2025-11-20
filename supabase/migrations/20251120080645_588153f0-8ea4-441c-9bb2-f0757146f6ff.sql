-- Fix fund with trailing space in category
UPDATE funds 
SET category = 'Private Equity'
WHERE category = 'Private Equity ';