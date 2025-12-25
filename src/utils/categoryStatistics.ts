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

  // Calculate average target return (exclude 0 values - they mean "not disclosed")
  const returnsWithData = funds
    .map(fund => {
      const { min, max } = getReturnTargetNumbers(fund);
      const validMin = min != null && min > 0 ? min : null;
      const validMax = max != null && max > 0 ? max : null;
      
      if (validMin != null && validMax != null) {
        return (validMin + validMax) / 2;
      }
      if (validMin != null) return validMin;
      if (validMax != null) return validMax;
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
