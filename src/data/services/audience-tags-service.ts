
import { Fund, FundTag } from '../types/funds';

// Function to generate audience segment tags for all funds
export const generateAudienceTags = (fund: Fund): FundTag[] => {
  // All funds are available to all audience segments for SEO purposes
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
