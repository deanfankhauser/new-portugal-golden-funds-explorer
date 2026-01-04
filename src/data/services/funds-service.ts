import { Fund, FundTag } from '../types/funds';
import { generateInvestmentTags } from './investment-tags-service';
import { generateRiskTags } from './risk-tags-service';
import { generateAPYTags } from './apy-tags-service';
import { generateLockupTags } from './lockup-tags-service';
import { generateManagementFeeTags } from './management-fee-tags-service';
import { generateFundSizeTags } from './fund-size-tags-service';
import { generateAudienceTags } from './audience-tags-service';

// Function to normalize risk tags
const normalizeRiskTags = (tags: string[]): FundTag[] => {
  return tags.map(tag => {
    // Normalize risk tags to use hyphens consistently
    if (tag === 'Low Risk') return 'Low-risk';
    if (tag === 'Medium Risk') return 'Medium-risk';
    if (tag === 'High Risk') return 'High-risk';
    return tag;
  }) as FundTag[];
};

// Function to add investment, risk, APY, lock-up, management fee, fund size, and audience tags to funds
export const addTagsToFunds = (funds: Fund[]): Fund[] => {
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