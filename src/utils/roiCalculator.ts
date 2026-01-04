import { Fund } from '../data/types/funds';

export interface ROICalculationResult {
  grossTotalValue: number;
  grossTotalReturn: number;
  grossAnnualizedReturn: number;
  netTotalValue: number;
  netTotalReturn: number;
  netAnnualizedReturn: number;
  totalFeesPaid: number;
  managementFeesPaid: number;
  performanceFeesPaid: number;
}

export const calculateROIWithFees = (
  investmentAmount: number,
  holdingPeriod: number,
  expectedReturn: number,
  fund?: Fund | null
): ROICalculationResult => {
  const annualReturnRate = expectedReturn / 100;
  const managementFeeRate = (fund?.managementFee || 0) / 100;
  const performanceFeeRate = (fund?.performanceFee || 0) / 100;
  const hurdleRate = (fund?.hurdleRate || 0) / 100;

  // Calculate GROSS returns (before fees)
  const grossTotalValue = investmentAmount * Math.pow(1 + annualReturnRate, holdingPeriod);
  const grossTotalReturn = grossTotalValue - investmentAmount;
  const grossAnnualizedReturn = ((grossTotalValue / investmentAmount) ** (1 / holdingPeriod) - 1) * 100;

  // Calculate NET returns (after fees)
  let currentValue = investmentAmount;
  let totalManagementFees = 0;
  let totalPerformanceFees = 0;

  for (let year = 1; year <= holdingPeriod; year++) {
    // Calculate gross gain for the year
    const grossGainThisYear = currentValue * annualReturnRate;
    
    // Deduct management fee
    const managementFee = currentValue * managementFeeRate;
    totalManagementFees += managementFee;
    
    // Calculate performance fee on gains above hurdle rate
    const hurdleGain = currentValue * hurdleRate;
    const excessGain = Math.max(0, grossGainThisYear - hurdleGain);
    const performanceFee = excessGain * performanceFeeRate;
    totalPerformanceFees += performanceFee;
    
    // Update value: add gross gain, subtract fees
    currentValue = currentValue + grossGainThisYear - managementFee - performanceFee;
  }

  const netTotalValue = currentValue;
  const netTotalReturn = netTotalValue - investmentAmount;
  const netAnnualizedReturn = ((netTotalValue / investmentAmount) ** (1 / holdingPeriod) - 1) * 100;
  const totalFeesPaid = totalManagementFees + totalPerformanceFees;

  return {
    grossTotalValue,
    grossTotalReturn,
    grossAnnualizedReturn,
    netTotalValue,
    netTotalReturn,
    netAnnualizedReturn,
    totalFeesPaid,
    managementFeesPaid: totalManagementFees,
    performanceFeesPaid: totalPerformanceFees,
  };
};
