/**
 * Tag Label Normalizer
 * Converts raw tag labels into clean, SEO-friendly versions for meta titles
 */

export const normalizeTagLabel = (rawTag: string): string => {
  const tagLower = rawTag.toLowerCase();
  
  // Investment range tags - convert to €-formatted with "Minimum"
  if (tagLower === '< €100k min. subscription') return '€100k or Less Minimum';
  if (tagLower === '€100k-€250k min. subscription') return '€100k–€250k Minimum';
  if (tagLower === '€250k-€350k min. subscription') return '€250k–€350k Minimum';
  if (tagLower === '€350k–€500k min. subscription') return '€350k–€500k Minimum';
  if (tagLower === '€500k+ min. subscription') return '€500k+ Minimum';
  
  // Fee tags - clean up with proper formatting
  if (tagLower === 'low fees (<1% management fee)') return 'Low-Fee (<1% Management)';
  if (tagLower === 'no performance fee') return 'No Performance Fee';
  
  // Lock-up period tags - standardize format
  if (tagLower === '< 5 year lock-up') return 'Under 5-Year Lock-Up';
  if (tagLower === '5-10 year lock-up') return '5–10 Year Lock-Up';
  if (tagLower === 'no lock-up') return 'No Lock-Up';
  
  // Risk level tags
  if (tagLower === 'low risk') return 'Low-Risk';
  if (tagLower === 'medium risk') return 'Medium-Risk';
  if (tagLower === 'high risk') return 'High-Risk';
  
  // Strategy/objective tags
  if (tagLower === 'income-focused') return 'Income-Focused';
  if (tagLower === 'growth-focused') return 'Growth-Focused';
  if (tagLower === 'dividend paying') return 'Dividend-Paying';
  if (tagLower === 'diversified portfolio') return 'Diversified Portfolio';
  
  // Liquidity tags
  if (tagLower === 'daily nav') return 'Daily NAV';
  if (tagLower === 'quarterly nav') return 'Quarterly NAV';
  if (tagLower === 'monthly nav') return 'Monthly NAV';
  
  // Eligibility/compliance tags
  if (tagLower === 'gv eligible') return 'GV-intended (manager-stated)';
  if (tagLower === 'golden visa eligible') return 'GV-intended (manager-stated)';
  if (tagLower === 'verified') return 'Verified';
  if (tagLower === 'ucits') return 'UCITS';
  
  // Sector tags
  if (tagLower === 'digital assets') return 'Digital Asset';
  if (tagLower === 'venture capital') return 'Venture Capital';
  if (tagLower === 'private equity') return 'Private Equity';
  if (tagLower === 'esg') return 'ESG';
  if (tagLower === 'healthcare & life sciences') return 'Healthcare & Life Sciences';
  if (tagLower === 'logistics & warehouses') return 'Logistics & Warehouses';
  if (tagLower === 'hospitality & hotels') return 'Hospitality & Hotels';
  if (tagLower === 'clean energy') return 'Clean Energy';
  
  // Investor nationality tags
  if (tagLower === 'golden visa funds for u.s. citizens') return 'U.S. Citizens';
  if (tagLower === 'golden visa funds for uk citizens') return 'UK Citizens';
  if (tagLower === 'golden visa funds for chinese citizens') return 'Chinese Citizens';
  
  // Default: return the tag as-is with title case
  return rawTag;
};

/**
 * Format minimum investment amount for titles
 */
export const formatMinimumForTitle = (minimumInvestment?: number): string | null => {
  if (!minimumInvestment) return null;
  
  if (minimumInvestment >= 1000000) {
    const millions = minimumInvestment / 1000000;
    return `€${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  } else if (minimumInvestment >= 1000) {
    const thousands = minimumInvestment / 1000;
    return `€${thousands.toFixed(0)}k`;
  } else {
    return `€${minimumInvestment}`;
  }
};
