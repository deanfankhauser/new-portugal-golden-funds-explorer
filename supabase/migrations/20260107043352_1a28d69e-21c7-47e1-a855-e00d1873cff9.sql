-- Update Lakeview Fund category from Real Estate to Infrastructure
-- This fund is a tourism/hospitality development project
UPDATE public.funds 
SET category = 'Infrastructure',
    updated_at = now()
WHERE id = 'lakeview-fund' 
  AND category = 'Real Estate';