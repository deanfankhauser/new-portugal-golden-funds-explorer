
import { Fund, FundTag } from '../types/funds';

// Function to determine fund size level based on fund's size
export const generateFundSizeTags = (fund: Fund): FundTag[] => {
  // Fund size tags removed as per restructuring (too granular)
  return [];
};

// Fund size filtering removed as per tag restructuring
export const getFundsByFundSizeLevel = (funds: Fund[]): Fund[] => {
  return funds;
};
