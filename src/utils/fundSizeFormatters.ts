/**
 * Centralized fund size formatting utilities
 */

export const formatFundSize = (fundSize: number | null | undefined): string => {
  if (fundSize === null || fundSize === undefined || fundSize === 0) {
    return 'Not disclosed';
  }
  if (fundSize < 1) {
    return `€${(fundSize * 1000000).toLocaleString()} EUR`;
  }
  return `€${fundSize}M EUR`;
};
