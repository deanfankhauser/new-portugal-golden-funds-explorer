import { Fund } from '../types/funds';
import { normalizeComparisonSlug } from '../../utils/comparisonUtils';

/**
 * Creates a normalized comparison slug from two fund IDs
 */
export const createComparisonSlug = (fund1Id: string, fund2Id: string): string => {
  const sortedIds = [fund1Id, fund2Id].sort();
  return `${sortedIds[0]}-vs-${sortedIds[1]}`;
};

/**
 * Parses a comparison slug into individual fund IDs
 */
export const parseComparisonSlug = (slug: string): { fund1Id: string; fund2Id: string } | null => {
  const normalizedSlug = normalizeComparisonSlug(slug);
  const parts = normalizedSlug.split('-vs-');
  if (parts.length !== 2) return null;
  
  return {
    fund1Id: parts[0],
    fund2Id: parts[1]
  };
};

/**
 * Generates all possible comparison combinations from a funds array
 * Used by comparison hub and related comparisons
 */
export const generateComparisonsFromFunds = (funds: Fund[]): Array<{ fund1: Fund; fund2: Fund; slug: string }> => {
  const comparisons: Array<{ fund1: Fund; fund2: Fund; slug: string }> = [];
  const seenSlugs = new Set<string>();
  
  for (let i = 0; i < funds.length; i++) {
    for (let j = i + 1; j < funds.length; j++) {
      const fund1 = funds[i];
      const fund2 = funds[j];
      const slug = createComparisonSlug(fund1.id, fund2.id);
      
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);
      
      comparisons.push({ fund1, fund2, slug });
    }
  }
  
  return comparisons.sort((a, b) => a.slug.localeCompare(b.slug));
};
