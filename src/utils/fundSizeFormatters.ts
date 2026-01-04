/**
 * Centralized fund size formatting utilities
 * 
 * IMPORTANT: Fund size is now stored in BASE EUR (not millions)
 * This file re-exports from centralized currencyFormatters for backward compatibility
 */

import { formatFundSize as formatFundSizeBase, formatCurrencyValue } from './currencyFormatters';

// Re-export the centralized formatter
export const formatFundSize = formatFundSizeBase;

// Legacy export for any code still using formatCurrencyValue
export { formatCurrencyValue };
