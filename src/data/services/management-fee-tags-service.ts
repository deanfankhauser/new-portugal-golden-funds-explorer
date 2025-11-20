
import { Fund, FundTag } from '../types/funds';

// Function to determine management fee level based on fund's management fee
export const generateManagementFeeTags = (fund: Fund): FundTag[] => {
  const tags: FundTag[] = [];
  
  const managementFee = fund.managementFee;
  
  if (managementFee < 1) {
    tags.push('Low fees (<1% management fee)');
  }
  // Note: Other management fee bands removed as per restructuring
  
  return tags;
};

// Function to get funds by management fee level
export const getFundsByManagementFeeLevel = (funds: Fund[], feeLevel: 'Low fees (<1% management fee)'): Fund[] => {
  return funds.filter(fund => fund.tags.includes(feeLevel));
};
