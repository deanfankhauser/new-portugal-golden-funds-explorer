-- Fix corrupted AUM values
-- BlueWater Capital Fund has 4e+13 which is obviously wrong (40 trillion)
-- Setting to NULL to display as "Not disclosed"
UPDATE funds SET aum = NULL WHERE id = 'bluewater-capital-fund';

-- Fortitude Portugal Special Situations II has aum = 150 which appears to be 150M intended
-- 150 is too small to be in EUR, likely entered as "150" meaning "150 million"
UPDATE funds SET aum = 150000000 WHERE id = 'fortitude-special-situations-ii';