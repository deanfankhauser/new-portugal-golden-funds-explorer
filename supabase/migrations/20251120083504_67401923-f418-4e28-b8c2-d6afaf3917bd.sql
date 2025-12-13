-- Remove legacy "Equities" and "Hybrid" tags from all funds
UPDATE funds 
SET tags = array_remove(array_remove(tags, 'Equities'), 'Hybrid')
WHERE 'Equities' = ANY(tags) OR 'Hybrid' = ANY(tags);

-- Verify cleanup
SELECT id, name, tags 
FROM funds 
WHERE 'Equities' = ANY(tags) OR 'Hybrid' = ANY(tags);