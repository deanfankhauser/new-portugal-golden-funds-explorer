
import { Fund, FundTag } from '../types/funds';

// Function to generate investment-based tags for a fund
export const generateInvestmentTags = (minimumInvestment: number): FundTag[] => {
  const tags: FundTag[] = [];
  
  // Fund subscription minimums - replace old "Under" tags
  if (minimumInvestment < 250000) {
    tags.push('Fund subscription minimums');
  } else if (minimumInvestment < 300000) {
    tags.push('Fund subscription minimums');
  } else if (minimumInvestment < 350000) {
    tags.push('Fund subscription minimums');
  } else if (minimumInvestment < 400000) {
    tags.push('Fund subscription minimums');
  } else if (minimumInvestment < 500000) {
    tags.push('Fund subscription minimums');
  }
  
  // Range tags - only add the most specific range
  if (minimumInvestment >= 250000 && minimumInvestment <= 350000) {
    tags.push('€250k-€350k');
  } else if (minimumInvestment >= 300000 && minimumInvestment <= 400000) {
    tags.push('€300k-€400k');
  } else if (minimumInvestment >= 350000 && minimumInvestment <= 500000) {
    tags.push('€350k-€500k');
  } else if (minimumInvestment >= 400000 && minimumInvestment <= 600000) {
    tags.push('€400k-€600k');
  } else if (minimumInvestment >= 500000) {
    tags.push('€500k+');
  }
  
  // Remove duplicates using Set
  return [...new Set(tags)];
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
