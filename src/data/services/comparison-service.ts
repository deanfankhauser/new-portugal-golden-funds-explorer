
import { funds } from './funds-service';
import { Fund } from '../types/funds';
import { normalizeComparisonSlug } from '../../utils/comparisonUtils';

// Generate all possible fund combinations for comparison
export const generateFundComparisons = (): Array<{ fund1: Fund; fund2: Fund; slug: string }> => {
  const comparisons: Array<{ fund1: Fund; fund2: Fund; slug: string }> = [];
  const seenSlugs = new Set<string>();
  
  if (!funds || funds.length === 0) {
    console.error('❌ CRITICAL: No funds available for comparison generation');
    console.error('❌ Funds type:', typeof funds, 'Length:', funds?.length);
    console.error('❌ This will result in 0 comparison pages in sitemap');
    return [];
  }
  
  console.log(`✅ Generating comparisons from ${funds.length} funds...`);
  
  for (let i = 0; i < funds.length; i++) {
    for (let j = i + 1; j < funds.length; j++) {
      const fund1 = funds[i];
      const fund2 = funds[j];
      const slug = normalizeComparisonSlug(`${fund1.id}-vs-${fund2.id}`);
      
      // Skip if we've already seen this normalized slug
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);
      
      // Ensure fund1 and fund2 are ordered consistently with the normalized slug
      const [firstId, secondId] = slug.split('-vs-');
      const orderedFund1 = funds.find(f => f.id === firstId)!;
      const orderedFund2 = funds.find(f => f.id === secondId)!;
      
      comparisons.push({
        fund1: orderedFund1,
        fund2: orderedFund2,
        slug
      });
    }
  }
  
  // Sort by slug for consistency
  const result = comparisons.sort((a, b) => a.slug.localeCompare(b.slug));
  
  // Log for debugging
  if (result.length === 0) {
    console.error('❌ CRITICAL: Generated 0 comparison slugs from', funds.length, 'funds');
  }
  
  return result;
};

// Get a specific comparison by slug
export const getComparisonBySlug = (slug: string): { fund1: Fund; fund2: Fund } | null => {
  // Normalize the slug first
  const normalizedSlug = normalizeComparisonSlug(slug);
  const parts = normalizedSlug.split('-vs-');
  if (parts.length !== 2) return null;
  
  const fund1 = funds.find(f => f.id === parts[0]);
  const fund2 = funds.find(f => f.id === parts[1]);
  
  if (!fund1 || !fund2) return null;
  
  return { fund1, fund2 };
};

// Get all comparison slugs
export const getAllComparisonSlugs = (): string[] => {
  const slugs = generateFundComparisons().map(c => c.slug);
  
  // Expected: 28 funds = 378 unique pairwise comparisons
  const expectedComparisons = (funds.length * (funds.length - 1)) / 2;
  
  if (slugs.length !== expectedComparisons) {
    console.warn(`⚠️  Comparison slug mismatch: Generated ${slugs.length}, expected ${expectedComparisons}`);
  }
  
  return slugs;
};
