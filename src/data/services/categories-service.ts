
import { FundCategory, Fund } from '../types/funds';
import { sortFundsByRank } from '../../utils/fundSorting';

// Function to get all unique categories from funds
export const getAllCategories = (funds: Fund[]): FundCategory[] => {
  const categoriesSet = new Set<FundCategory>();
  funds.forEach(fund => {
    categoriesSet.add(fund.category);
  });
  return Array.from(categoriesSet);
};

// Function to get funds by category
// Returns funds sorted by verification status and rank
export const getFundsByCategory = (funds: Fund[], category: FundCategory): Fund[] => {
  const filtered = funds.filter(fund => fund.category === category);
  return sortFundsByRank(filtered);
};
