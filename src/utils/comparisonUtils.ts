import { Fund } from '../data/types/funds';

// Utility functions for fund comparison slug handling

/**
 * Normalizes comparison slugs to ensure consistent ordering (fund1-vs-fund2)
 * where fund1 comes before fund2 alphabetically
 */
export const normalizeComparisonSlug = (slug: string): string => {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return slug;
  
  const [fund1, fund2] = parts;
  
  // Sort alphabetically to ensure consistent ordering
  const sortedFunds = [fund1, fund2].sort();
  return `${sortedFunds[0]}-vs-${sortedFunds[1]}`;
};

/**
 * Checks if a comparison slug is in the canonical format
 */
export const isCanonicalComparisonSlug = (slug: string): boolean => {
  return slug === normalizeComparisonSlug(slug);
};

/**
 * Creates a normalized comparison slug from two fund IDs
 */
export const createComparisonSlug = (fund1Id: string, fund2Id: string): string => {
  const sortedIds = [fund1Id, fund2Id].sort();
  return `${sortedIds[0]}-vs-${sortedIds[1]}`;
};

/**
 * Determines if a comparison should be noindexed based on low-value signals:
 * - Same category AND same manager (likely internal fund variants)
 * - Neither fund is verified AND same category with minimal metric differences
 * 
 * Returns true if the comparison should be noindexed
 */
export const isLowValueComparison = (fund1: Fund, fund2: Fund): boolean => {
  // Signal 1: Same manager AND same category (likely internal fund variants with minimal differentiation)
  const sameManager = fund1.managerName?.toLowerCase() === fund2.managerName?.toLowerCase();
  const sameCategory = fund1.category === fund2.category;
  
  // Signal 2: Neither fund is verified
  const noVerifiedFund = !fund1.isVerified && !fund2.isVerified;
  
  // Signal 3: Minimal difference in key metrics
  const feesDiff = Math.abs((fund1.managementFee || 0) - (fund2.managementFee || 0));
  const minInvestDiff = Math.abs((fund1.minimumInvestment || 0) - (fund2.minimumInvestment || 0));
  const termDiff = Math.abs((fund1.term || 0) - (fund2.term || 0));
  
  const minimalDifference = feesDiff < 0.3 && minInvestDiff < 50000 && termDiff <= 1;
  
  // Low value if: same manager + same category + minimal difference
  // This catches internal fund series that offer no differentiation value to searchers
  if (sameManager && sameCategory && minimalDifference) {
    return true;
  }
  
  // Also low value if: neither verified + same category + minimal difference
  // These comparisons have low trust signals and no meaningful comparison value
  if (noVerifiedFund && sameCategory && minimalDifference) {
    return true;
  }
  
  return false;
};