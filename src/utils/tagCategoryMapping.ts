export const TAG_CATEGORY_FALLBACKS: Record<string, string> = {
  'Energy': 'Clean Energy',
  'Clean Energy': 'Clean Energy',
  'ESG': 'Real Estate',
  'Healthcare & life sciences': 'Venture Capital',
  'Tourism': 'Real Estate',
  'Hospitality & hotels': 'Real Estate',
  'Residential real estate': 'Real Estate',
  'Commercial real estate': 'Real Estate',
  'Logistics & warehouses': 'Real Estate',
  'Bitcoin': 'Bitcoin',
  'Crypto': 'Crypto',
  'Income-focused': 'Debt',
  'Dividend paying': 'Debt',
  'Low fees': 'Real Estate',
  'No Lock-Up': 'Real Estate',
  'Short lock-up (<5 years)': 'Real Estate',
  'Long lock-up (5–10 years)': 'Private Equity',
};

export const getTagFallbackCategory = (tagName: string): string => {
  return TAG_CATEGORY_FALLBACKS[tagName] || 'Private Equity';
};
