
import { Fund } from '../types/funds';
import { fundsData } from '../mock/funds';
import { generateInvestmentTags } from './investment-tags-service';
import { generateRiskTags } from './risk-tags-service';
import { generateAPYTags } from './apy-tags-service';
import { generateLockupTags } from './lockup-tags-service';
import { generateManagementFeeTags } from './management-fee-tags-service';
import { generateFundSizeTags } from './fund-size-tags-service';

// Function to add investment, risk, APY, lock-up, management fee, and fund size tags to funds
const addTagsToFunds = (funds: Fund[]): Fund[] => {
  return funds.map(fund => {
    const investmentTags = generateInvestmentTags(fund.minimumInvestment);
    const riskTags = generateRiskTags(fund);
    const apyTags = generateAPYTags(fund);
    const lockupTags = generateLockupTags(fund);
    const managementFeeTags = generateManagementFeeTags(fund);
    const fundSizeTags = generateFundSizeTags(fund);
    return {
      ...fund,
      tags: [...fund.tags, ...investmentTags, ...riskTags, ...apyTags, ...lockupTags, ...managementFeeTags, ...fundSizeTags]
    };
  });
};

// Export funds with all generated tags added
export const funds = addTagsToFunds(fundsData);

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
