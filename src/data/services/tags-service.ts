
import { FundTag, Fund } from '../types/funds';
import { fundsData } from '../mock/funds';

// Function to get all unique tags from funds
export const getAllTags = (): FundTag[] => {
  const tagsSet = new Set<FundTag>();
  fundsData.forEach(fund => {
    fund.tags.forEach(tag => {
      tagsSet.add(tag);
    });
  });
  return Array.from(tagsSet);
};

// Function to get funds by tag
export const getFundsByTag = (tag: FundTag): Fund[] => {
  return fundsData.filter(fund => fund.tags.includes(tag));
};
