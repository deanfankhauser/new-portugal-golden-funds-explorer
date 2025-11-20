/**
 * Centralized fee formatting utilities
 * Single source of truth for all fee display logic
 */

export const formatManagementFee = (fee: number | null | undefined): string => {
  if (fee === null || fee === undefined) return 'Not disclosed';
  if (fee === 0) return 'None';
  return `${fee}%`;
};

export const formatPerformanceFee = (fee: number | null | undefined): string => {
  if (fee === null || fee === undefined) return 'Not disclosed';
  if (fee === 0) return 'None';
  return `${fee}%`;
};

export const formatSubscriptionFee = (fee: number | null | undefined): string => {
  if (fee === null || fee === undefined) return 'Not disclosed';
  if (fee === 0) return 'None';
  return `${fee}%`;
};

export const formatRedemptionFee = (fee: number | null | undefined): string => {
  if (fee === null || fee === undefined) return 'Not disclosed';
  if (fee === 0) return 'None';
  return `${fee}%`;
};
