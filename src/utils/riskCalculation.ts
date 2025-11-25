import type { Fund, RiskBand } from '../data/types/funds';

/**
 * Calculate 3-band risk classification for a fund
 * Conservative: Lower risk investments (Debt, Infrastructure, UCITS, Capital Preservation)
 * Balanced: Medium risk investments (Real Estate, Private Equity, mixed strategies)
 * Aggressive: Higher risk investments (VC, Crypto, High-risk tags, leverage indicators)
 */
export const calculateRiskBand = (fund: Fund): RiskBand => {
  // Conservative indicators
  const isConservative = (
    fund.category === 'Debt' ||
    fund.category === 'Infrastructure' ||
    fund.category === 'Credit' ||
    fund.tags.includes('Bonds') ||
    fund.tags.includes('UCITS') ||
    fund.tags.includes('Capital Preservation') ||
    fund.tags.includes('Fixed Income') ||
    fund.tags.includes('Deposits') ||
    fund.tags.includes('Low-risk')
  );

  // Aggressive indicators
  const isAggressive = (
    fund.category === 'Venture Capital' ||
    fund.category === 'Crypto' ||
    fund.category === 'Bitcoin' ||
    fund.tags.includes('High-risk') ||
    fund.tags.includes('Bitcoin') ||
    fund.tags.includes('Ethereum') ||
    fund.tags.includes('Solana') ||
    fund.tags.includes('Digital Assets') ||
    fund.performanceFee >= 20 ||
    (fund.expectedReturnMin && fund.expectedReturnMin >= 15)
  );

  // Determine risk band
  if (isAggressive) {
    return 'Aggressive';
  } else if (isConservative) {
    return 'Conservative';
  } else {
    return 'Balanced'; // Default: Real Estate, PE, mixed strategies
  }
};

/**
 * Get display label for risk band
 */
export const getRiskBandLabel = (band: RiskBand): string => {
  const labels: Record<RiskBand, string> = {
    'Conservative': 'Conservative Risk',
    'Balanced': 'Balanced Risk',
    'Aggressive': 'Aggressive Risk'
  };
  return labels[band];
};

/**
 * Get color class for risk band
 */
export const getRiskBandColor = (band: RiskBand): string => {
  const colors: Record<RiskBand, string> = {
    'Conservative': 'text-green-600',
    'Balanced': 'text-orange-600',
    'Aggressive': 'text-red-600'
  };
  return colors[band];
};

/**
 * Get background color class for risk band badges
 */
export const getRiskBandBgColor = (band: RiskBand): string => {
  const colors: Record<RiskBand, string> = {
    'Conservative': 'bg-green-100 text-green-800',
    'Balanced': 'bg-orange-100 text-orange-800',
    'Aggressive': 'bg-red-100 text-red-800'
  };
  return colors[band];
};

// ============= LEGACY 7-LEVEL SYSTEM (Backward Compatibility) =============
// Keep for existing code that still uses numeric risk scores

/**
 * @deprecated Use calculateRiskBand instead for new code
 */
export const calculateRiskScore = (fund: Fund): number => {
  let score = 4; // Default medium risk
  
  // High risk factors - check categories not tags
  if (fund.category === 'Venture Capital' || fund.category === 'Crypto') score += 2;
  if (fund.performanceFee >= 20) score += 1;
  if (fund.minimumInvestment >= 250000) score += 1;
  
  // Low risk factors  
  if (fund.tags.includes('Bonds') || fund.tags.includes('UCITS')) score -= 2;
  if (fund.category === 'Infrastructure' || fund.category === 'Debt') score -= 1;
  if (fund.managementFee <= 1.5) score -= 1;
  
  return Math.max(1, Math.min(7, score));
};

/**
 * @deprecated Use getRiskBandLabel instead for new code
 */
export const riskLabels = {
  1: { label: 'Very Low Risk', color: 'text-green-600' },
  2: { label: 'Low Risk', color: 'text-green-500' },
  3: { label: 'Low-Medium Risk', color: 'text-yellow-600' },
  4: { label: 'Medium Risk', color: 'text-orange-600' },
  5: { label: 'Medium-High Risk', color: 'text-orange-700' },
  6: { label: 'High Risk', color: 'text-red-600' },
  7: { label: 'Very High Risk', color: 'text-red-700' }
};

/**
 * @deprecated Use getRiskBandLabel instead for new code
 */
export const getRiskLabel = (score: number): string => {
  return riskLabels[score as keyof typeof riskLabels]?.label || 'Medium Risk';
};

/**
 * @deprecated Use getRiskBandColor instead for new code
 */
export const getRiskColor = (score: number): string => {
  return riskLabels[score as keyof typeof riskLabels]?.color || 'text-orange-600';
};
