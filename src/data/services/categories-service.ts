
import { FundCategory, Fund } from '../types/funds';
import { fundsData } from '../mock/funds';

// Function to get all unique categories from funds
export const getAllCategories = (): FundCategory[] => {
  const categoriesSet = new Set<FundCategory>();
  fundsData.forEach(fund => {
    categoriesSet.add(fund.category);
  });
  return Array.from(categoriesSet);
};

// Function to get funds by category
export const getFundsByCategory = (category: FundCategory): Fund[] => {
  return fundsData.filter(fund => fund.category === category);
};
