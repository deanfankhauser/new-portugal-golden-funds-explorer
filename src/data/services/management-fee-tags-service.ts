
import { Fund, FundTag } from '../types/funds';

// Function to determine management fee level based on fund's management fee
export const generateManagementFeeTags = (fund: Fund): FundTag[] => {
  const tags: FundTag[] = [];
  
  const managementFee = fund.managementFee;
  
  if (managementFee < 1) {
    tags.push('< 1% management fee');
  } else if (managementFee >= 1 && managementFee <= 1.5) {
    tags.push('1-1.5% management fee');
  } else if (managementFee > 1.5) {
    tags.push('> 1.5% management fee');
  }
  
  return tags;
};

// Function to get funds by management fee level
export const getFundsByManagementFeeLevel = (funds: Fund[], feeLevel: '< 1% management fee' | '1-1.5% management fee' | '> 1.5% management fee'): Fund[] => {
  return funds.filter(fund => fund.tags.includes(feeLevel));
};
