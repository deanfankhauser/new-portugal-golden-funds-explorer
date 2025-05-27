
import { Fund, FundTag } from '../types/funds';

// Function to determine fund size level based on fund's size
export const generateFundSizeTags = (fund: Fund): FundTag[] => {
  const tags: FundTag[] = [];
  
  const fundSize = fund.fundSize; // Fund size is in EUR millions
  
  if (fundSize < 50) {
    tags.push('Small-cap < €50M');
  } else if (fundSize >= 50 && fundSize <= 100) {
    tags.push('Mid-cap €50-100M');
  } else if (fundSize > 100) {
    tags.push('Large-cap > €100M');
  }
  
  return tags;
};

// Function to get funds by size level
export const getFundsByFundSizeLevel = (funds: Fund[], sizeLevel: 'Small-cap < €50M' | 'Mid-cap €50-100M' | 'Large-cap > €100M'): Fund[] => {
  return funds.filter(fund => fund.tags.includes(sizeLevel));
};
