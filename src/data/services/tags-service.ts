
import { FundTag, Fund } from '../types/funds';
import { funds } from './funds-service';
import { getGVEligibleFunds } from './gv-eligibility-service';

// Function to get all unique tags from funds (now includes investment tags)
export const getAllTags = (): FundTag[] => {
  const tagsSet = new Set<FundTag>();
  funds.forEach(fund => {
    fund.tags.forEach(tag => {
      tagsSet.add(tag);
    });
  });
  const sortedTags = Array.from(tagsSet).sort(); // Sort tags alphabetically for consistency
  
  // Debug logging
  // Return sorted unique tags
  
  return sortedTags;
};

// Function to get funds by tag (now works with investment tags)
export const getFundsByTag = (tag: FundTag): Fund[] => {
  // Filter funds by tag
  let matchingFunds = funds.filter(fund => fund.tags.includes(tag));
  
  // All funds are now GV eligible, so no additional filtering needed
  
  return matchingFunds;
};
