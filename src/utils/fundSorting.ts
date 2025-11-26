import { Fund } from '../data/types/funds';

/**
 * Centralized fund sorting utility
 * Sorts funds by verification status first, then by final rank
 * Lower rank numbers = higher priority
 */
export const sortFundsByRank = (funds: Fund[]): Fund[] => {
  return [...funds].sort((a, b) => {
    // Verified funds first
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    
    // Then by finalRank (lower rank = higher priority)
    const aRank = a.finalRank ?? 999;
    const bRank = b.finalRank ?? 999;
    return aRank - bRank;
  });
};

/**
 * Sort funds by rank only (ignoring verification status)
 * Useful for contexts where verification is already filtered
 */
export const sortByRankOnly = (funds: Fund[]): Fund[] => {
  return [...funds].sort((a, b) => {
    const aRank = a.finalRank ?? 999;
    const bRank = b.finalRank ?? 999;
    return aRank - bRank;
  });
};
