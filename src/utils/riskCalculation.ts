import type { Fund } from '../data/types/funds';

// Calculate risk score based on fund characteristics
export const calculateRiskScore = (fund: Fund): number => {
  let score = 4; // Default medium risk
  
  // High risk factors
  if (fund.tags.includes('Venture Capital') || fund.tags.includes('Crypto')) score += 2;
  if (fund.performanceFee >= 20) score += 1;
  if (fund.minimumInvestment >= 250000) score += 1;
  
  // Low risk factors  
  if (fund.tags.includes('Bonds') || fund.tags.includes('UCITS')) score -= 2;
  if (fund.category === 'Infrastructure' || fund.category === 'Debt') score -= 1;
  if (fund.managementFee <= 1.5) score -= 1;
  
  return Math.max(1, Math.min(7, score));
};

// Risk level labels
export const riskLabels = {
  1: { label: 'Very Low Risk', color: 'text-green-600' },
  2: { label: 'Low Risk', color: 'text-green-500' },
  3: { label: 'Low-Medium Risk', color: 'text-yellow-600' },
  4: { label: 'Medium Risk', color: 'text-orange-600' },
  5: { label: 'Medium-High Risk', color: 'text-orange-700' },
  6: { label: 'High Risk', color: 'text-red-600' },
  7: { label: 'Very High Risk', color: 'text-red-700' }
};

export const getRiskLabel = (score: number): string => {
  return riskLabels[score as keyof typeof riskLabels]?.label || 'Medium Risk';
};

export const getRiskColor = (score: number): string => {
  return riskLabels[score as keyof typeof riskLabels]?.color || 'text-orange-600';
};