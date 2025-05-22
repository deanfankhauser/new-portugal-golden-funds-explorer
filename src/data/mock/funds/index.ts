
import { horizonFund } from './horizon-fund';
import { optimizeGoldenOpportunities } from './optimize-golden-opportunities';
import { threeCommaCGoldenIncome } from './3cc-golden-income';
import { portugalInvestment1 } from './portugal-investment-1';
import { steadyGrowthInvestment } from './steady-growth-investment';
import { growthBlueFund } from './growth-blue-fund';
import { Fund } from '../../types/funds';

// Export all funds as an array
export const fundsData: Fund[] = [
  horizonFund,
  optimizeGoldenOpportunities,
  threeCommaCGoldenIncome,
  portugalInvestment1,
  steadyGrowthInvestment,
  growthBlueFund
];

// Export individual funds
export {
  horizonFund,
  optimizeGoldenOpportunities,
  threeCommaCGoldenIncome,
  portugalInvestment1,
  steadyGrowthInvestment,
  growthBlueFund
};
