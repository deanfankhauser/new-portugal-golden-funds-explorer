import { Fund } from '@/data/types/funds';

// Filter funds by fee disclosure

export const getFundsWithDisclosedManagementFee = (funds: Fund[]): Fund[] =>
  funds.filter(f => f.managementFee !== null && f.managementFee !== undefined);

export const getFundsWithDisclosedPerformanceFee = (funds: Fund[]): Fund[] =>
  funds.filter(f => f.performanceFee !== null && f.performanceFee !== undefined);

export const getFundsWithSubscriptionFee = (funds: Fund[]): Fund[] =>
  funds.filter(f => f.subscriptionFee !== null && f.subscriptionFee !== undefined && f.subscriptionFee > 0);

export const getFundsWithRedemptionFee = (funds: Fund[]): Fund[] =>
  funds.filter(f => f.redemptionFee !== null && f.redemptionFee !== undefined && f.redemptionFee > 0);

// Fee range bucket types
export type ManagementFeeRange = 'low' | 'medium' | 'high' | 'very-high';

const MANAGEMENT_FEE_RANGES: Record<ManagementFeeRange, [number, number]> = {
  'low': [0, 1],
  'medium': [1, 1.5],
  'high': [1.5, 2],
  'very-high': [2, Infinity]
};

export const filterByManagementFeeRange = (funds: Fund[], range: ManagementFeeRange): Fund[] => {
  const [min, max] = MANAGEMENT_FEE_RANGES[range];
  return funds.filter(f => {
    if (f.managementFee === null || f.managementFee === undefined) return false;
    return f.managementFee >= min && f.managementFee < max;
  });
};

// Get fee range label
export const getManagementFeeRangeLabel = (range: ManagementFeeRange): string => {
  switch (range) {
    case 'low': return 'Under 1%';
    case 'medium': return '1% – 1.5%';
    case 'high': return '1.5% – 2%';
    case 'very-high': return 'Over 2%';
  }
};

// Calculate fee statistics for a set of funds
export interface FeeStatistics {
  avgManagementFee: number | null;
  medianManagementFee: number | null;
  minManagementFee: number | null;
  maxManagementFee: number | null;
  fundsWithManagementFee: number;
  fundsWithPerformanceFee: number;
  fundsWithSubscriptionFee: number;
  fundsWithRedemptionFee: number;
  totalFunds: number;
}

export const calculateFeeStatistics = (funds: Fund[]): FeeStatistics => {
  const fundsWithMgmtFee = getFundsWithDisclosedManagementFee(funds);
  const mgmtFees = fundsWithMgmtFee.map(f => f.managementFee!).sort((a, b) => a - b);
  
  const avg = mgmtFees.length > 0 
    ? mgmtFees.reduce((sum, fee) => sum + fee, 0) / mgmtFees.length 
    : null;
  
  const median = mgmtFees.length > 0
    ? mgmtFees.length % 2 === 0
      ? (mgmtFees[mgmtFees.length / 2 - 1] + mgmtFees[mgmtFees.length / 2]) / 2
      : mgmtFees[Math.floor(mgmtFees.length / 2)]
    : null;
  
  return {
    avgManagementFee: avg ? Math.round(avg * 100) / 100 : null,
    medianManagementFee: median ? Math.round(median * 100) / 100 : null,
    minManagementFee: mgmtFees.length > 0 ? mgmtFees[0] : null,
    maxManagementFee: mgmtFees.length > 0 ? mgmtFees[mgmtFees.length - 1] : null,
    fundsWithManagementFee: fundsWithMgmtFee.length,
    fundsWithPerformanceFee: getFundsWithDisclosedPerformanceFee(funds).length,
    fundsWithSubscriptionFee: getFundsWithSubscriptionFee(funds).length,
    fundsWithRedemptionFee: getFundsWithRedemptionFee(funds).length,
    totalFunds: funds.length
  };
};

// Get funds sorted by management fee (ascending)
export const getFundsSortedByManagementFee = (funds: Fund[]): Fund[] => {
  return getFundsWithDisclosedManagementFee(funds)
    .sort((a, b) => (a.managementFee || 0) - (b.managementFee || 0));
};

// Get funds sorted by total annual fees (management + estimated ongoing costs)
export const getFundsSortedByTotalFees = (funds: Fund[]): Fund[] => {
  return getFundsWithDisclosedManagementFee(funds)
    .sort((a, b) => {
      const totalA = (a.managementFee || 0);
      const totalB = (b.managementFee || 0);
      return totalA - totalB;
    });
};
