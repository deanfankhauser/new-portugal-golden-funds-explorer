-- Data Quality Cleanup Queries
-- Run these to identify and fix underlying data issues

-- 1. Find all funds with 0 fees (review if these should be NULL)
SELECT id, name, management_fee, performance_fee, subscription_fee, redemption_fee
FROM funds 
WHERE management_fee = 0 
   OR performance_fee = 0 
   OR subscription_fee = 0 
   OR redemption_fee = 0;

-- 2. Find funds with missing return targets
SELECT id, name, expected_return_min, expected_return_max 
FROM funds 
WHERE expected_return_min IS NULL AND expected_return_max IS NULL;

-- 3. Find funds with decimal return values (verify these look correct)
SELECT id, name, expected_return_min, expected_return_max 
FROM funds 
WHERE (expected_return_min IS NOT NULL AND expected_return_min != FLOOR(expected_return_min))
   OR (expected_return_max IS NOT NULL AND expected_return_max != FLOOR(expected_return_max));

-- 4. CLEANUP EXAMPLE: Convert genuine no-fee funds to explicit NULL
-- (Review results from query #1 first, then update only if truly undisclosed)
-- UPDATE funds SET management_fee = NULL WHERE id = 'fund-id-here' AND management_fee = 0;

-- 5. VERIFICATION: Check formatting after changes
SELECT 
  id, 
  name,
  CASE 
    WHEN management_fee IS NULL THEN 'Not disclosed'
    WHEN management_fee = 0 THEN 'None'
    ELSE management_fee || '%'
  END as management_fee_display,
  CASE 
    WHEN expected_return_min IS NOT NULL AND expected_return_max IS NOT NULL THEN
      CASE 
        WHEN expected_return_min = expected_return_max THEN expected_return_min || '% p.a.'
        ELSE expected_return_min || '–' || expected_return_max || '% p.a.'
      END
    WHEN expected_return_min IS NOT NULL THEN expected_return_min || '% p.a.'
    ELSE 'Not disclosed'
  END as return_target_display
FROM funds 
ORDER BY name;
