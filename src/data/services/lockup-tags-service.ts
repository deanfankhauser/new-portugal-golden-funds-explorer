
import { Fund, FundTag } from '../types/funds';

// Function to determine lock-up period based on fund's redemption terms
export const generateLockupTags = (fund: Fund): FundTag[] => {
  const tags: FundTag[] = [];
  
  // Only assign lock-up tags if fund is actually locked up (not open for redemption)
  // AND explicitly exclude funds that already have "No Lock-Up" tag to avoid conflicts
  if (fund.tags.includes('No Lock-Up')) {
    return []; // Don't add any lockup tags if the fund explicitly has "No Lock-Up"
  }
  
  if (fund.redemptionTerms?.frequency === 'End of Term' && !fund.redemptionTerms.redemptionOpen) {
    // If fund is locked until maturity, use the fund term
    const termYears = fund.term;
    
    if (termYears < 5) {
      tags.push('< 5-year lock-up');
    } else if (termYears >= 5 && termYears <= 10) {
      tags.push('5-10 year lock-up');
    } else if (termYears > 10) {
      tags.push('> 10-year lock-up');
    }
  }
  // If no lock-up information is available, don't assign any lock-up tags
  
  return tags;
};

// Function to get funds by lock-up period
export const getFundsByLockupPeriod = (funds: Fund[], lockupPeriod: '< 5-year lock-up' | '5-10 year lock-up' | '> 10-year lock-up'): Fund[] => {
  return funds.filter(fund => fund.tags.includes(lockupPeriod));
};
