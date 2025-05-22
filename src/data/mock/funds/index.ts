
import { horizonFund } from './horizon-fund';
import { optimizeGoldenOpportunities } from './optimize-golden-opportunities';
import { threeCommaCGoldenIncome } from './3cc-golden-income';
import { lisboaRealEstateGrowthFund } from './lisboa-real-estate-growth-fund';
import { portoInnovationVentures } from './porto-innovation-ventures';
import { algarveTourismHospitalityFund } from './algarve-tourism-hospitality-fund';
import { portugalInvestment1 } from './portugal-investment-1';
import { Fund } from '../../types/funds';

// Export all funds as an array
export const fundsData: Fund[] = [
  horizonFund,
  optimizeGoldenOpportunities,
  threeCommaCGoldenIncome,
  lisboaRealEstateGrowthFund,
  portoInnovationVentures,
  algarveTourismHospitalityFund,
  portugalInvestment1
];

// Export individual funds
export {
  horizonFund,
  optimizeGoldenOpportunities,
  threeCommaCGoldenIncome,
  lisboaRealEstateGrowthFund,
  portoInnovationVentures,
  algarveTourismHospitalityFund,
  portugalInvestment1
};
