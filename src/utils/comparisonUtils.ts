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