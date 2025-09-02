
import { Fund, FundTag } from '../types/funds';
import { isFundGVEligible } from './gv-eligibility-service';

// Function to generate audience segment tags for GV-eligible funds only
export const generateAudienceTags = (fund: Fund): FundTag[] => {
  // Only return GV audience tags for GV-eligible funds
  if (!isFundGVEligible(fund)) {
    return [];
  }
  
  return [
    'Golden Visa funds for U.S. citizens',
    'Golden Visa funds for Australian citizens',
    'Golden Visa funds for UK citizens',
    'Golden Visa funds for Canadian citizens',
    'Golden Visa funds for Chinese citizens'
  ];
};

// Function to get funds by audience segment
export const getFundsByAudienceSegment = (funds: Fund[], audienceSegment: 'Golden Visa funds for U.S. citizens' | 'Golden Visa funds for Australian citizens' | 'Golden Visa funds for UK citizens' | 'Golden Visa funds for Canadian citizens' | 'Golden Visa funds for Chinese citizens'): Fund[] => {
  return funds.filter(fund => fund.tags.includes(audienceSegment));
};
