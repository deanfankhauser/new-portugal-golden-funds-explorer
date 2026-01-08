import { Fund } from '../data/types/funds';
import { getReturnTargetNumbers } from './returnTarget';

export interface SmartDefaults {
  investmentAmount: number;
  investmentAmountSource: string;
  holdingPeriod: number;
  holdingPeriodSource: string;
  expectedReturn: number;
  expectedReturnSource: string;
  hasFundReturnData: boolean;
}

export const getSmartDefaults = (fund: Fund): SmartDefaults => {
  const { min, max } = getReturnTargetNumbers(fund);
  const hasFundReturnData = min != null || max != null;
  
  // Investment Amount
  let investmentAmount = 100000; // Default €100k
  let investmentAmountSource = 'Typical minimum';
  if (fund.minimumInvestment && fund.minimumInvestment > 0) {
    investmentAmount = fund.minimumInvestment;
    investmentAmountSource = `Fund minimum: ${new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(fund.minimumInvestment)}`;
  }
  
  // Holding Period
  const holdingPeriod = 5;
  const holdingPeriodSource = 'Typical holding period';
  
  // Expected Return
  let expectedReturn = 8; // Conservative default
  let expectedReturnSource = 'Industry average assumption';
  
  if (hasFundReturnData) {
    if (min != null && max != null) {
      expectedReturn = (min + max) / 2;
      expectedReturnSource = `Fund target: ${min}-${max}% p.a.`;
    } else if (min != null) {
      expectedReturn = min;
      expectedReturnSource = `Fund target: ${min}% p.a.`;
    } else if (max != null) {
      expectedReturn = max;
      expectedReturnSource = `Fund target: ${max}% p.a.`;
    }
  }
  
  return {
    investmentAmount,
    investmentAmountSource,
    holdingPeriod,
    holdingPeriodSource,
    expectedReturn,
    expectedReturnSource,
    hasFundReturnData
  };
};
