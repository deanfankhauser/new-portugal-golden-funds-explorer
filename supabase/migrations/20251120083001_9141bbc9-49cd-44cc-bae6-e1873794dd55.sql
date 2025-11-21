-- Tags restructuring: Remove duplicates, rename for clarity, add new SEO tags

-- Step 1: Remove tags that duplicate categories or are too specific
UPDATE funds SET tags = array_remove(tags, 'Crypto') WHERE 'Crypto' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Debt') WHERE 'Debt' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Private Equity') WHERE 'Private Equity' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Real Estate') WHERE 'Real Estate' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Venture Capital') WHERE 'Venture Capital' = ANY(tags);

-- Step 2: Remove redundant tags
UPDATE funds SET tags = array_remove(tags, 'Golden Visa') WHERE 'Golden Visa' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Portugal') WHERE 'Portugal' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Equity') WHERE 'Equity' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Lock-Up') WHERE 'Lock-Up' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Fund subscription minimums') WHERE 'Fund subscription minimums' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Quadrantis Capital') WHERE 'Quadrantis Capital' = ANY(tags);

-- Step 3: Remove overly granular fee/yield tags
UPDATE funds SET tags = array_remove(tags, '1-1.5% management fee') WHERE '1-1.5% management fee' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, '> 1.5% management fee') WHERE '> 1.5% management fee' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, '5 % Yield') WHERE '5 % Yield' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, '< 3% annual yield') WHERE '< 3% annual yield' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, '12% Return') WHERE '12% Return' = ANY(tags);

-- Step 4: Remove cap-size bands
UPDATE funds SET tags = array_remove(tags, 'Small-cap < €50M') WHERE 'Small-cap < €50M' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Mid-Cap') WHERE 'Mid-Cap' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Mid-cap €50-100M') WHERE 'Mid-cap €50-100M' = ANY(tags);
UPDATE funds SET tags = array_remove(tags, 'Large-cap > €100M') WHERE 'Large-cap > €100M' = ANY(tags);

-- Step 5: Remove duplicate structure tag
UPDATE funds SET tags = array_remove(tags, 'Closed Ended') WHERE 'Closed Ended' = ANY(tags);

-- Step 6: Replace old tags with new consolidated ones
-- Replace "< 1% management fee" with "Low fees (<1% management fee)"
UPDATE funds 
SET tags = array_append(array_remove(tags, '< 1% management fee'), 'Low fees (<1% management fee)')
WHERE '< 1% management fee' = ANY(tags);

-- Replace "3-5% annual yield" with "Target yield 3–5%"
UPDATE funds 
SET tags = array_append(array_remove(tags, '3-5% annual yield'), 'Target yield 3–5%')
WHERE '3-5% annual yield' = ANY(tags);

-- Replace "> 5% annual yield" with "Target yield 5%+"
UPDATE funds 
SET tags = array_append(array_remove(tags, '> 5% annual yield'), 'Target yield 5%+')
WHERE '> 5% annual yield' = ANY(tags);

-- Replace "5% Dividend" with "Dividend paying"
UPDATE funds 
SET tags = array_append(array_remove(tags, '5% Dividend'), 'Dividend paying')
WHERE '5% Dividend' = ANY(tags);

-- Replace "< 5-year lock-up" with "Short lock-up (<5 years)"
UPDATE funds 
SET tags = array_append(array_remove(tags, '< 5-year lock-up'), 'Short lock-up (<5 years)')
WHERE '< 5-year lock-up' = ANY(tags);

-- Replace "5-10 year lock-up" with "Long lock-up (5–10 years)"
UPDATE funds 
SET tags = array_append(array_remove(tags, '5-10 year lock-up'), 'Long lock-up (5–10 years)')
WHERE '5-10 year lock-up' = ANY(tags);

-- Step 7: Rename subscription minimum tags for consistency
UPDATE funds 
SET tags = array_append(array_remove(tags, '€100k-250k'), 'Min. subscription €100k–250k')
WHERE '€100k-250k' = ANY(tags);

UPDATE funds 
SET tags = array_append(array_remove(tags, '€250k-€350k (subscription min only; GV still requires €500k total)'), 'Min. subscription €250k–€350k')
WHERE '€250k-€350k (subscription min only; GV still requires €500k total)' = ANY(tags);

UPDATE funds 
SET tags = array_append(array_remove(tags, '€300k-€400k (subscription min only; GV still requires €500k total)'), 'Min. subscription €250k–€350k')
WHERE '€300k-€400k (subscription min only; GV still requires €500k total)' = ANY(tags);

UPDATE funds 
SET tags = array_append(array_remove(tags, '€350k-€500k (subscription min only; GV still requires €500k total)'), 'Min. subscription €350k–€500k')
WHERE '€350k-€500k (subscription min only; GV still requires €500k total)' = ANY(tags);

UPDATE funds 
SET tags = array_append(array_remove(tags, '€400k-€600k (subscription min only; GV still requires €500k total)'), 'Min. subscription €500k+')
WHERE '€400k-€600k (subscription min only; GV still requires €500k total)' = ANY(tags);

UPDATE funds 
SET tags = array_append(array_remove(tags, '€500k+'), 'Min. subscription €500k+')
WHERE '€500k+' = ANY(tags);