
import { horizonFund } from './horizon-fund';
import { optimizeGoldenOpportunities } from './optimize-golden-opportunities';
import { threeCommaCGoldenIncome } from './3cc-golden-income';
import { portugalInvestment1 } from './portugal-investment-1';
import { steadyGrowthInvestment } from './steady-growth-investment';
import { growthBlueFund } from './growth-blue-fund';
import { linceGrowthFund } from './lince-growth-fund';
import { linceYieldFund } from './lince-yield-fund';
import { solarFutureFund } from './solar-future-fund';
import { mercurioFundII } from './mercurio-fund-ii';
import { portugalLiquidOpportunities } from './portugal-liquid-opportunities';
import { heedTopFund } from './heed-top-fund';
import { venturesEUFund } from './ventures-eu-fund';
import { flexSpaceFund } from './flex-space-fund';
import { Fund } from '../../types/funds';

// Export all funds as an array
export const fundsData: Fund[] = [
  horizonFund,
  optimizeGoldenOpportunities,
  threeCommaCGoldenIncome,
  portugalInvestment1,
  steadyGrowthInvestment,
  growthBlueFund,
  linceGrowthFund,
  linceYieldFund,
  solarFutureFund,
  mercurioFundII,
  portugalLiquidOpportunities,
  heedTopFund,
  venturesEUFund,
  flexSpaceFund
];

// Export individual funds
export {
  horizonFund,
  optimizeGoldenOpportunities,
  threeCommaCGoldenIncome,
  portugalInvestment1,
  steadyGrowthInvestment,
  growthBlueFund,
  linceGrowthFund,
  linceYieldFund,
  solarFutureFund,
  mercurioFundII,
  portugalLiquidOpportunities,
  heedTopFund,
  venturesEUFund,
  flexSpaceFund
};
