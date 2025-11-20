
import { Fund, FundTag } from '../types/funds';

// Function to generate investment-based tags for a fund
export const generateInvestmentTags = (minimumInvestment: number): FundTag[] => {
  const tags: FundTag[] = [];
  
  // Add specific subscription minimum tags
  if (minimumInvestment >= 100000 && minimumInvestment < 250000) {
    tags.push('Min. subscription €100k–250k');
  } else if (minimumInvestment >= 250000 && minimumInvestment < 350000) {
    tags.push('Min. subscription €250k–€350k');
  } else if (minimumInvestment >= 350000 && minimumInvestment < 500000) {
    tags.push('Min. subscription €350k–€500k');
  } else if (minimumInvestment >= 500000) {
    tags.push('Min. subscription €500k+');
  }
  
  return tags;
};

// Function to get funds by investment amount (helper for investment-based filtering)
export const getFundsByInvestmentRange = (funds: Fund[], minAmount?: number, maxAmount?: number): Fund[] => {
  return funds.filter(fund => {
    if (minAmount !== undefined && fund.minimumInvestment < minAmount) {
      return false;
    }
    if (maxAmount !== undefined && fund.minimumInvestment > maxAmount) {
      return false;
    }
    return true;
  });
};

// Function to get funds under a specific amount
export const getFundsUnderAmount = (funds: Fund[], amount: number): Fund[] => {
  return funds.filter(fund => fund.minimumInvestment < amount);
};
