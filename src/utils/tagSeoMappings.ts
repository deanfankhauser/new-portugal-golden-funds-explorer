export const TAG_TITLE_MAPPINGS: Record<string, string> = {
  'Energy': 'Renewable Energy & Solar Funds for Portugal Golden Visa',
  'Clean Energy': 'Renewable Energy & Solar Funds for Portugal Golden Visa',
  'Tourism': 'Hospitality & Tourism Funds for Portugal Golden Visa',
  'Hospitality & hotels': 'Hospitality & Tourism Funds for Portugal Golden Visa',
  'ESG': 'ESG & Sustainable Investment Funds for Portugal Golden Visa',
  'Healthcare & life sciences': 'Healthcare & Life Sciences Funds for Portugal Golden Visa',
  'Residential real estate': 'Residential Real Estate Funds for Portugal Golden Visa',
  'Commercial real estate': 'Commercial Real Estate Funds for Portugal Golden Visa',
  'Logistics & warehouses': 'Logistics & Industrial Funds for Portugal Golden Visa',
  'Bitcoin': 'Bitcoin Investment Funds for Portugal Golden Visa',
  'Crypto': 'Cryptocurrency Investment Funds for Portugal Golden Visa',
  'Income-focused': 'Income & Dividend Funds for Portugal Golden Visa',
  'Dividend paying': 'Dividend-Paying Funds for Portugal Golden Visa',
};

export const getTagSeoTitle = (tagName: string): string => {
  return TAG_TITLE_MAPPINGS[tagName] || `Top ${tagName} Investment Funds for Portugal Golden Visa`;
};
