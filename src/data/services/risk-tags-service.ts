
import { Fund, FundTag } from '../types/funds';

// Function to determine risk level based on fund characteristics
export const generateRiskTags = (fund: Fund): FundTag[] => {
  const tags: FundTag[] = [];
  
  // Analyze fund characteristics to determine risk level
  const isLowRisk = (
    // Fixed income, bonds, deposits are typically low risk
    fund.tags.includes('Bonds') ||
    fund.tags.includes('Deposits') ||
    fund.tags.includes('Capital Preservation') ||
    fund.tags.includes('UCITS') ||
    // Balanced funds with diversification
    fund.category === 'Balanced' ||
    fund.category === 'Fixed Income & Digital Assets' ||
    // Infrastructure tends to be lower risk
    fund.category === 'Infrastructure' ||
    // Low management fees often indicate conservative strategies
    fund.managementFee <= 1.5
  );
  
  const isHighRisk = (
    // Venture capital and crypto are high risk
    fund.tags.includes('Venture Capital') ||
    fund.tags.includes('Crypto') ||
    fund.tags.includes('Bitcoin') ||
    fund.tags.includes('Ethereum') ||
    fund.tags.includes('Solana') ||
    fund.category === 'Venture Capital' ||
    // High performance fees indicate higher risk/return strategies
    fund.performanceFee >= 20 ||
    // High target returns typically mean higher risk
    (fund.returnTarget.includes('12%') || fund.returnTarget.includes('15%') || fund.returnTarget.includes('20%'))
  );
  
  // Assign risk tags
  if (isHighRisk) {
    tags.push('High-risk');
  } else if (isLowRisk) {
    tags.push('Low-risk');
  } else {
    // Default to medium risk for everything else
    tags.push('Medium-risk');
  }
  
  return tags;
};

// Function to get funds by risk level
export const getFundsByRiskLevel = (funds: Fund[], riskLevel: 'Low-risk' | 'Medium-risk' | 'High-risk'): Fund[] => {
  return funds.filter(fund => fund.tags.includes(riskLevel));
};
