import { Fund } from '../data/types/funds';

/**
 * Centralized utility to determine fund type with consistent priority logic:
 * 1. Check explicit tags first ("Open Ended" or "Closed Ended")
 * 2. Fall back to structural analysis if no explicit tags exist
 */
export const getFundType = (fund: Fund): 'Open-Ended' | 'Closed-End' => {
  // Priority 1: Check explicit tags (handles edited funds)
  if (fund.tags?.includes('Open Ended')) {
    return 'Open-Ended';
  }
  if (fund.tags?.includes('Closed-end Fund')) {
    return 'Closed-End';
  }
  
  // Priority 2: Fallback to structural analysis for legacy/untagged funds
  const isStructurallyOpenEnded = 
    !fund.term || 
    fund.term === 0 || 
    (fund.redemptionTerms?.minimumHoldingPeriod === 0 && fund.redemptionTerms?.frequency);
  
  return isStructurallyOpenEnded ? 'Open-Ended' : 'Closed-End';
};

/**
 * Check if fund is open-ended (for backward compatibility)
 */
export const isOpenEnded = (fund: Fund): boolean => {
  return getFundType(fund) === 'Open-Ended';
};

/**
 * Check if fund is closed-end (for clarity)
 */
export const isClosedEnd = (fund: Fund): boolean => {
  return getFundType(fund) === 'Closed-End';
};