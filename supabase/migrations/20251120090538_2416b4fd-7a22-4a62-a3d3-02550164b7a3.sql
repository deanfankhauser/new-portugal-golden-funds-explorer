-- Assign SEO tags to funds based on existing tags and categories

-- ESG tag: Sustainability-focused funds
UPDATE public.funds
SET tags = array_append(tags, 'ESG')
WHERE (
  'Sustainability' = ANY(tags) OR
  'Renewable Energy' = ANY(tags) OR
  'Clean Energy' = ANY(tags) OR
  'Circular Economy' = ANY(tags) OR
  'Climate' = ANY(tags) OR
  category = 'Clean Energy'
)
AND NOT ('ESG' = ANY(tags));

-- Healthcare & life sciences: Medical/pharma funds
UPDATE public.funds
SET tags = array_append(tags, 'Healthcare & life sciences')
WHERE (
  'Healthcare' = ANY(tags) OR
  'Life Sciences' = ANY(tags) OR
  'Pharma' = ANY(tags) OR
  'Medical' = ANY(tags) OR
  'Biotech' = ANY(tags)
)
AND NOT ('Healthcare & life sciences' = ANY(tags));

-- Logistics & warehouses: Industrial real estate funds
UPDATE public.funds
SET tags = array_append(tags, 'Logistics & warehouses')
WHERE (
  'Industrial' = ANY(tags) OR
  'Logistics' = ANY(tags) OR
  'Warehouses' = ANY(tags)
)
AND NOT ('Logistics & warehouses' = ANY(tags));

-- Hospitality & hotels: Tourism/hotel funds
UPDATE public.funds
SET tags = array_append(tags, 'Hospitality & hotels')
WHERE (
  'Tourism' = ANY(tags) OR
  'Hospitality' = ANY(tags) OR
  'Hotels' = ANY(tags)
)
AND NOT ('Hospitality & hotels' = ANY(tags));

-- Residential real estate: Residential property funds
UPDATE public.funds
SET tags = array_append(tags, 'Residential real estate')
WHERE (
  category = 'Real Estate' AND (
    'Residential' = ANY(tags) OR
    'Housing' = ANY(tags) OR
    'Apartments' = ANY(tags)
  )
)
AND NOT ('Residential real estate' = ANY(tags));

-- Commercial real estate: Commercial property funds
UPDATE public.funds
SET tags = array_append(tags, 'Commercial real estate')
WHERE (
  category = 'Real Estate' AND (
    'Commercial' = ANY(tags) OR
    'Office' = ANY(tags) OR
    'Retail' = ANY(tags)
  )
)
AND NOT ('Commercial real estate' = ANY(tags));

-- Income-focused: Yield-generating funds
UPDATE public.funds
SET tags = array_append(tags, 'Income-focused')
WHERE (
  'Dividend paying' = ANY(tags) OR
  'Target yield 5%+' = ANY(tags) OR
  'Target yield 3–5%' = ANY(tags) OR
  'Fixed Income' = ANY(tags) OR
  'High Yield' = ANY(tags) OR
  category = 'Debt'
)
AND NOT ('Income-focused' = ANY(tags));