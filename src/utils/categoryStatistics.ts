import { Fund } from '../data/types/funds';
import { getReturnTargetNumbers } from './returnTarget';

export interface CategoryStatistics {
  avgTargetReturn: number | null;
  avgMinInvestment: number | null;
  typicalLockup: string;
  gvEligibleCount: number;
  totalCount: number;
}

export const calculateCategoryStatistics = (funds: Fund[]): CategoryStatistics => {
  if (funds.length === 0) {
    return {
      avgTargetReturn: null,
      avgMinInvestment: null,
      typicalLockup: 'Not disclosed',
      gvEligibleCount: 0,
      totalCount: 0
    };
  }

  // Calculate average target return
  const returnsWithData = funds
    .map(fund => {
      const { min, max } = getReturnTargetNumbers(fund);
      if (min != null && max != null) {
        return (min + max) / 2; // Average of range
      }
      if (min != null) return min;
      if (max != null) return max;
      return null;
    })
    .filter((val): val is number => val !== null);

  const avgTargetReturn = returnsWithData.length > 0
    ? returnsWithData.reduce((sum, val) => sum + val, 0) / returnsWithData.length
    : null;

  // Calculate average minimum investment
  const minInvestmentsWithData = funds
    .map(fund => fund.minimumInvestment)
    .filter((val): val is number => val != null && val > 0);

  const avgMinInvestment = minInvestmentsWithData.length > 0
    ? minInvestmentsWithData.reduce((sum, val) => sum + val, 0) / minInvestmentsWithData.length
    : null;

  // Calculate typical lock-up period (most common)
  const lockupCounts: Record<string, number> = {};
  funds.forEach(fund => {
    // Access lock_up_period_months directly from database-backed funds
    const lockup = (fund as any).lock_up_period_months;
    if (lockup != null) {
      const key = lockup === 0 ? 'None' : `${lockup} months`;
      lockupCounts[key] = (lockupCounts[key] || 0) + 1;
    }
  });

  const typicalLockup = Object.keys(lockupCounts).length > 0
    ? Object.entries(lockupCounts).sort((a, b) => b[1] - a[1])[0][0]
    : 'Not disclosed';

  // Count Golden Visa eligible funds
  const gvEligibleCount = funds.filter(fund => 
    fund.tags?.includes('Golden Visa Eligible')
  ).length;

  return {
    avgTargetReturn,
    avgMinInvestment,
    typicalLockup,
    gvEligibleCount,
    totalCount: funds.length
  };
};
