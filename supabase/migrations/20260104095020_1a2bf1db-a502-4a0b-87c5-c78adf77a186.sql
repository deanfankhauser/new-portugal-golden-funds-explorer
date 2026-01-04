-- Fix additional corrupted AUM value
-- Portugal Liquid Opportunities has 2e+11 (200 billion) which is wrong
-- Setting to NULL to display as "Not disclosed"
UPDATE funds SET aum = NULL WHERE id = 'portugal-liquid-opportunities';