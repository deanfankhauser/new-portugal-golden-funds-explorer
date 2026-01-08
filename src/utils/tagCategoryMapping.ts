export const TAG_CATEGORY_FALLBACKS: Record<string, string> = {
  'Energy': 'Clean Energy',
  'Clean Energy': 'Clean Energy',
  'ESG': 'Infrastructure',
  'Healthcare & life sciences': 'Venture Capital',
  'Tourism': 'Infrastructure',
  'Hospitality & hotels': 'Private Equity',
  'Logistics & warehouses': 'Infrastructure',
  'Bitcoin': 'Bitcoin',
  'Crypto': 'Crypto',
  'Income-focused': 'Debt',
  'Dividend paying': 'Debt',
  'Low fees': 'Debt',
  'No Lock-Up': 'Debt',
  'Short lock-up (<5 years)': 'Debt',
  'Long lock-up (5–10 years)': 'Private Equity',
};

export const getTagFallbackCategory = (tagName: string): string => {
  return TAG_CATEGORY_FALLBACKS[tagName] || 'Private Equity';
};
