import { Fund, FundCategory, FundTag } from '../types/funds';

// Golden Visa eligibility rules as of October 2023
const GV_INELIGIBLE_CATEGORIES: FundCategory[] = ['Real Estate'];

const GV_INELIGIBLE_TAGS: FundTag[] = [
  'Real Estate'
];

// Check if a fund is Golden Visa eligible
export const isFundGVEligible = (fund: Fund): boolean => {
  // Check category eligibility
  if (GV_INELIGIBLE_CATEGORIES.includes(fund.category)) {
    return false;
  }
  
  // Check for ineligible tags
  const hasIneligibleTags = fund.tags.some(tag => GV_INELIGIBLE_TAGS.includes(tag));
  if (hasIneligibleTags) {
    return false;
  }
  
  // Check Portugal allocation requirement (≥60%)
  if (fund.eligibilityBasis?.portugalAllocation && 
      typeof fund.eligibilityBasis.portugalAllocation === 'number' && 
      fund.eligibilityBasis.portugalAllocation < 60) {
    return false;
  }
  
  return true;
};

// Check if a category is Golden Visa eligible
export const isCategoryGVEligible = (category: FundCategory): boolean => {
  return !GV_INELIGIBLE_CATEGORIES.includes(category);
};

// Check if a tag is Golden Visa eligible
export const isTagGVEligible = (tag: FundTag): boolean => {
  return !GV_INELIGIBLE_TAGS.includes(tag);
};

// Get only GV eligible funds from a list
export const getGVEligibleFunds = (funds: Fund[]): Fund[] => {
  return funds.filter(isFundGVEligible);
};

// Get GV eligibility status message
export const getGVEligibilityMessage = (isEligible: boolean): string => {
  return isEligible ? 'Golden Visa Eligible' : 'Not Golden Visa Eligible';
};

// Get GV eligibility warning for categories/tags
export const getGVIneligibilityWarning = (type: 'category' | 'tag', name: string): string => {
  return `⚠️ Since October 2023, ${name} funds are not eligible for Portugal Golden Visa applications due to new regulations excluding real estate-linked investments.`;
};