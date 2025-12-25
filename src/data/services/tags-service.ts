
import { FundTag, Fund } from '../types/funds';
import { sortFundsByRank } from '../../utils/fundSorting';

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
// Returns funds sorted by verification status and rank
export const getFundsByTag = (funds: Fund[], tag: FundTag): Fund[] => {
  const filtered = funds.filter(fund => fund.tags.includes(tag));
  return sortFundsByRank(filtered);
};
