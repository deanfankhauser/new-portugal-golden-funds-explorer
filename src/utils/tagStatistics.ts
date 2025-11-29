import { Fund } from '../data/types/funds';
import { getReturnTargetNumbers } from './returnTarget';

export interface TagStatistics {
  avgTargetYield: number | null;
  avgLockupPeriod: number | null;
  gvEligibleCount: number;
  totalCount: number;
}

export const calculateTagStatistics = (funds: Fund[]): TagStatistics => {
  if (funds.length === 0) {
    return {
      avgTargetYield: null,
      avgLockupPeriod: null,
      gvEligibleCount: 0,
      totalCount: 0,
    };
  }

  // Calculate average target yield
  const validYields = funds
    .map(fund => {
      const { min, max } = getReturnTargetNumbers(fund);
      if (min != null && max != null && max > 0) {
        return (min + max) / 2;
      }
      if (min != null) return min;
      return null;
    })
    .filter((y): y is number => y !== null);

  const avgTargetYield = validYields.length > 0
    ? validYields.reduce((sum, y) => sum + y, 0) / validYields.length
    : null;

  // Calculate average lock-up period
  const validLockups = funds
    .map(fund => (fund as any).lock_up_period_months)
    .filter((l): l is number => typeof l === 'number' && l > 0);

  const avgLockupPeriod = validLockups.length > 0
    ? validLockups.reduce((sum, l) => sum + l, 0) / validLockups.length
    : null;

  // Count GV eligible funds
  const gvEligibleCount = funds.filter(fund => 
    fund.tags.includes('Golden Visa Eligible')
  ).length;

  return {
    avgTargetYield,
    avgLockupPeriod,
    gvEligibleCount,
    totalCount: funds.length,
  };
};
