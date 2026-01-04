/**
 * Centralized currency formatting utilities
 * 
 * CRITICAL: All values are expected in BASE EUR (not millions)
 * Formatting happens at render time only
 */

/**
 * Format a currency value with intelligent scaling
 * @param value - Amount in base EUR (e.g., 1000000 for €1M)
 * @param options - Formatting options
 * @returns Formatted string like "€1.5M", "€500,000", "€500", or "Not disclosed"
 */
export const formatCurrencyValue = (
  value: number | null | undefined,
  options?: { 
    showNotDisclosed?: boolean;
    forceNotDisclosedOnZero?: boolean;
  }
): string => {
  const { showNotDisclosed = true, forceNotDisclosedOnZero = true } = options || {};
  
  // Handle null/undefined/0 as "Not disclosed"
  if (value === null || value === undefined) {
    return showNotDisclosed ? 'Not disclosed' : '€0';
  }
  
  if (value === 0 && forceNotDisclosedOnZero) {
    return showNotDisclosed ? 'Not disclosed' : '€0';
  }
  
  // Handle billions (>= 1,000,000,000)
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    // Clean formatting: remove .0 for whole numbers
    const formatted = billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1);
    return `€${formatted}B`;
  }
  
  // Handle millions (>= 1,000,000)
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    // Clean formatting: remove .0 for whole numbers
    const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return `€${formatted}M`;
  }
  
  // Handle thousands (>= 1,000)
  if (value >= 1_000) {
    return `€${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  
  // Small values
  return `€${value}`;
};

/**
 * Format fund size (AUM) - expects value in BASE EUR
 * @param aumInEur - Fund size in base EUR
 * @returns Formatted string like "€50M" or "Not disclosed"
 */
export const formatFundSize = (aumInEur: number | null | undefined): string => {
  return formatCurrencyValue(aumInEur);
};

/**
 * Format minimum investment - expects value in BASE EUR
 * @param amount - Minimum investment in base EUR
 * @returns Formatted string like "€500,000" or "Not disclosed"
 */
export const formatMinimumInvestment = (amount: number | null | undefined): string => {
  return formatCurrencyValue(amount);
};

/**
 * Format Assets Under Management - expects value in BASE EUR
 * @param aumInEur - AUM in base EUR
 * @returns Formatted string like "€1.5B" or "Not disclosed"
 */
export const formatAUM = (aumInEur: number | null | undefined): string => {
  return formatCurrencyValue(aumInEur);
};

/**
 * Format currency for display with explicit "Not disclosed" handling
 * Use this when you need consistent display across comparison tables
 */
export const formatCurrencyForComparison = (value: number | null | undefined): string => {
  return formatCurrencyValue(value, { showNotDisclosed: true, forceNotDisclosedOnZero: true });
};
