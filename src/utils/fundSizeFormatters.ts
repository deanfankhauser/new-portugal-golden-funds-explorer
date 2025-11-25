/**
 * Centralized fund size formatting utilities
 */

export const formatFundSize = (fundSize: number | null | undefined): string => {
  if (fundSize === null || fundSize === undefined || fundSize === 0) {
    return 'Not disclosed';
  }
  
  // fundSize is stored in millions, convert to full value
  const fullValue = fundSize * 1000000;
  
  // Format with thousands separators and single € symbol
  return `€${fullValue.toLocaleString()}`;
};
