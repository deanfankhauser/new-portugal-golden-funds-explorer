import { Fund, FundTag } from '../data/types/funds';

export interface FilterOption {
  tag: FundTag;
  count: number;
  label: string;
}

export interface FilterGroup {
  title: string;
  filters: FilterOption[];
}

const MIN_FUND_COUNT = 3;

/**
 * Get only meaningful filters (those with 3+ funds)
 * Sorted by fund count descending
 */
export const getMeaningfulFilters = (funds: Fund[]): FilterOption[] => {
  const tagCounts = new Map<FundTag, number>();
  
  // Count occurrences of each tag
  funds.forEach(fund => {
    fund.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  // Filter and sort by count
  return Array.from(tagCounts.entries())
    .filter(([_, count]) => count >= MIN_FUND_COUNT)
    .map(([tag, count]) => ({
      tag,
      count,
      label: tag
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Get top filters by category
 */
export const getTopFilters = (funds: Fund[], limit: number = 8): FilterOption[] => {
  return getMeaningfulFilters(funds).slice(0, limit);
};

/**
 * Get categorized filters for expanded view
 */
export const getCategorizedFilters = (funds: Fund[]): FilterGroup[] => {
  const allFilters = getMeaningfulFilters(funds);
  
  const categoryTags = ['Venture Capital', 'Private Equity', 'Infrastructure', 'Debt', 'Bitcoin', 'Crypto', 'Clean Energy', 'Other'];
  const eligibilityTags = ['Golden Visa Eligible'];
  const structureTags = ['Closed-end Fund', 'Open Ended', 'Liquid'];
  const riskTags = ['Low-risk', 'Medium-risk', 'High-risk'];
  const featureTags = ['Dividend paying'];
  
  const groups: FilterGroup[] = [];
  
  // Investment Type
  const investmentFilters = allFilters.filter(f => categoryTags.includes(f.tag));
  if (investmentFilters.length > 0) {
    groups.push({ title: 'Investment Type', filters: investmentFilters });
  }
  
  // Eligibility
  const eligibilityFilters = allFilters.filter(f => eligibilityTags.includes(f.tag));
  if (eligibilityFilters.length > 0) {
    groups.push({ title: 'Eligibility', filters: eligibilityFilters });
  }
  
  // Structure
  const structureFilters = allFilters.filter(f => structureTags.includes(f.tag));
  if (structureFilters.length > 0) {
    groups.push({ title: 'Structure', filters: structureFilters });
  }
  
  // Risk Level
  const riskFilters = allFilters.filter(f => riskTags.includes(f.tag));
  if (riskFilters.length >= 2) { // Only show if we have at least 2 risk levels
    groups.push({ title: 'Risk Level', filters: riskFilters });
  }
  
  // Features
  const featureFilters = allFilters.filter(f => featureTags.includes(f.tag));
  if (featureFilters.length > 0) {
    groups.push({ title: 'Features', filters: featureFilters });
  }
  
  return groups;
};
