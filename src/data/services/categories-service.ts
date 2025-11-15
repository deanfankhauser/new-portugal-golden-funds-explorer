
import { FundCategory, Fund } from '../types/funds';

// Function to get all unique categories from funds
export const getAllCategories = (funds: Fund[]): FundCategory[] => {
  const categoriesSet = new Set<FundCategory>();
  funds.forEach(fund => {
    categoriesSet.add(fund.category);
  });
  return Array.from(categoriesSet);
};

// Function to get funds by category
export const getFundsByCategory = (funds: Fund[], category: FundCategory): Fund[] => {
  return funds.filter(fund => fund.category === category);
};
