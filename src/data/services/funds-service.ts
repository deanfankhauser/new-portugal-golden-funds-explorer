
import { Fund } from '../types/funds';
import { fundsData } from '../mock/funds';
import { generateInvestmentTags } from './investment-tags-service';

// Function to add investment tags to funds
const addInvestmentTagsToFunds = (funds: Fund[]): Fund[] => {
  return funds.map(fund => {
    const investmentTags = generateInvestmentTags(fund.minimumInvestment);
    return {
      ...fund,
      tags: [...fund.tags, ...investmentTags]
    };
  });
};

// Export funds with investment tags added
export const funds = addInvestmentTagsToFunds(fundsData);

// Function to get a fund by ID
export const getFundById = (id: string): Fund | undefined => {
  return funds.find(fund => fund.id === id);
};

// Function to search funds
export const searchFunds = (query: string): Fund[] => {
  const lowerCaseQuery = query.toLowerCase();
  return funds.filter(fund => 
    fund.name.toLowerCase().includes(lowerCaseQuery) ||
    fund.description.toLowerCase().includes(lowerCaseQuery) ||
    fund.managerName.toLowerCase().includes(lowerCaseQuery)
  );
};
