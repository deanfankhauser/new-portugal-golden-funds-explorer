import { Fund } from '../types/funds';
import { fundsData } from '../mock/funds';
import { generateInvestmentTags } from './investment-tags-service';
import { generateRiskTags } from './risk-tags-service';
import { generateAPYTags } from './apy-tags-service';
import { generateLockupTags } from './lockup-tags-service';
import { generateManagementFeeTags } from './management-fee-tags-service';
import { generateFundSizeTags } from './fund-size-tags-service';
import { generateAudienceTags } from './audience-tags-service';
import { FundDataMigrationService } from '../../services/fundDataMigrationService';

// Function to normalize risk tags
const normalizeRiskTags = (tags: string[]): string[] => {
  return tags.map(tag => {
    // Normalize risk tags to use hyphens consistently
    if (tag === 'Low Risk') return 'Low-risk';
    if (tag === 'Medium Risk') return 'Medium-risk';
    if (tag === 'High Risk') return 'High-risk';
    return tag;
  });
};

// Function to add investment, risk, APY, lock-up, management fee, fund size, and audience tags to funds
const addTagsToFunds = (funds: any[]): any[] => {
  return funds.map(fund => {
    const investmentTags = generateInvestmentTags(fund.minimumInvestment);
    const riskTags = generateRiskTags(fund);
    const apyTags = generateAPYTags(fund);
    const lockupTags = generateLockupTags(fund);
    const managementFeeTags = generateManagementFeeTags(fund);
    const fundSizeTags = generateFundSizeTags(fund);
    const audienceTags = generateAudienceTags(fund);
    
    // Combine all tags and remove duplicates using Set
    const allTags = [
      ...fund.tags, 
      ...investmentTags, 
      ...riskTags, 
      ...apyTags, 
      ...lockupTags, 
      ...managementFeeTags, 
      ...fundSizeTags, 
      ...audienceTags
    ];
    
    // Normalize risk tags and remove duplicates
    const normalizedTags = normalizeRiskTags([...new Set(allTags)]);
    
    return {
      ...fund,
      tags: normalizedTags
    };
  });
};

// Enhanced funds with investment, risk, APY, lock-up, management fee, fund size, audience tags, and date fields
const fundsWithTags = addTagsToFunds(fundsData);
export const funds: Fund[] = FundDataMigrationService.migrateFundsArray(fundsWithTags);

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