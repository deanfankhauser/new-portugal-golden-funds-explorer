
import { horizonFund } from './horizon-fund';
import { optimizeGoldenOpportunities } from './optimize-golden-opportunities';
import { threeCommaCGoldenIncome } from './3cc-golden-income';
import { portugalInvestment1 } from './portugal-investment-1';
import { Fund } from '../../types/funds';

// Export all funds as an array
export const fundsData: Fund[] = [
  horizonFund,
  optimizeGoldenOpportunities,
  threeCommaCGoldenIncome,
  portugalInvestment1
];

// Export individual funds
export {
  horizonFund,
  optimizeGoldenOpportunities,
  threeCommaCGoldenIncome,
  portugalInvestment1
};
