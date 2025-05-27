
import { funds } from './funds-service';
import { Fund } from '../types/funds';

// Generate all possible fund combinations for comparison
export const generateFundComparisons = (): Array<{ fund1: Fund; fund2: Fund; slug: string }> => {
  const comparisons: Array<{ fund1: Fund; fund2: Fund; slug: string }> = [];
  
  for (let i = 0; i < funds.length; i++) {
    for (let j = i + 1; j < funds.length; j++) {
      const fund1 = funds[i];
      const fund2 = funds[j];
      const slug = `${fund1.id}-vs-${fund2.id}`;
      
      comparisons.push({
        fund1,
        fund2,
        slug
      });
    }
  }
  
  return comparisons;
};

// Get a specific comparison by slug
export const getComparisonBySlug = (slug: string): { fund1: Fund; fund2: Fund } | null => {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;
  
  const fund1 = funds.find(f => f.id === parts[0]);
  const fund2 = funds.find(f => f.id === parts[1]);
  
  if (!fund1 || !fund2) return null;
  
  return { fund1, fund2 };
};

// Get all comparison slugs
export const getAllComparisonSlugs = (): string[] => {
  return generateFundComparisons().map(c => c.slug);
};
