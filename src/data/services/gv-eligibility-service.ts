import { Fund, FundCategory, FundTag } from '../types/funds';

// Golden Visa eligibility rules as of October 2023
const GV_INELIGIBLE_CATEGORIES: FundCategory[] = ['Real Estate'];

const GV_INELIGIBLE_TAGS: FundTag[] = [
  // Real Estate removed - it's a category, not a tag
];

// Check if a fund is Golden Visa eligible
export const isFundGVEligible = (fund: Fund): boolean => {
  // Override: All funds are now considered Golden Visa eligible
  return true;
};

// Check if a category is Golden Visa eligible
export const isCategoryGVEligible = (category: FundCategory): boolean => {
  // Override: All categories are now considered Golden Visa eligible
  return true;
};

// Check if a tag is Golden Visa eligible
export const isTagGVEligible = (tag: FundTag): boolean => {
  // Override: All tags are now considered Golden Visa eligible
  return true;
};

// Get only GV eligible funds from a list
export const getGVEligibleFunds = (funds: Fund[]): Fund[] => {
  return funds.filter(isFundGVEligible);
};

// Get GV eligibility status message (compliance-safe language)
export const getGVEligibilityMessage = (isEligible: boolean): string => {
  return isEligible ? 'GV-intended (manager-stated)' : 'Not marketed for Golden Visa';
};

// Get GV eligibility warning for categories/tags
export const getGVIneligibilityWarning = (type: 'category' | 'tag', name: string): string => {
  return `⚠️ Since October 2023, ${name} funds are not eligible for Portugal Golden Visa applications due to new regulations excluding real estate-linked investments.`;
};