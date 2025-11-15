
import { FundTag, Fund } from '../types/funds';

// Function to get all unique tags from funds (now includes investment tags)
export const getAllTags = (funds: Fund[]): FundTag[] => {
  const tagsSet = new Set<FundTag>();
  funds.forEach(fund => {
    fund.tags.forEach(tag => {
      tagsSet.add(tag);
    });
  });
  const sortedTags = Array.from(tagsSet).sort(); // Sort tags alphabetically for consistency
  
  return sortedTags;
};

// Function to get funds by tag (now works with investment tags)
export const getFundsByTag = (funds: Fund[], tag: FundTag): Fund[] => {
  return funds.filter(fund => fund.tags.includes(tag));
};
