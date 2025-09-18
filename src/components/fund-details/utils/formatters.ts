
/**
 * Utility functions for formatting fund data
 */

/**
 * Format a number as a currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  
  // Round to 2 decimal places and remove unnecessary trailing zeros
  const rounded = Math.round(value * 100) / 100;
  return `${rounded.toFixed(2).replace(/\.?0+$/, '')}%`;
};
