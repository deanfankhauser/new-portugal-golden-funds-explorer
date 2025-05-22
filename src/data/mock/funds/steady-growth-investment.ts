
import { Fund } from '../../types/funds';

export const steadyGrowthInvestment: Fund = {
  id: 'steady-growth-investment',
  name: 'Steady Growth Investment Fund',
  description: 'Your path to secure wealth building through a diversified, actively managed multi-asset strategy combining bonds, equities, gold and deposits, tailored for Golden Visa investors in Portugal.',
  tags: [
    'Golden Visa Eligible',
    'Bonds',
    'Equities',
    'Liquid',
    'Balanced',
    'Low Risk',
    'Capital Preservation',
    'Capital Growth',
    'Sustainability',
    'Infrastructure'
  ],
  category: 'Multi-Asset',
  minimumInvestment: 0, // N/A
  fundSize: 0, // N/A
  managementFee: 0, // N/A
  performanceFee: 0, // N/A
  subscriptionFee: 0, // N/A
  redemptionFee: 0, // N/A
  term: 0, // N/A
  managerName: 'Celtis Venture Partners',
  managerLogo: undefined,
  returnTarget: 'N/A',
  fundStatus: 'Open', // Default to Open since status was marked as N/A
  websiteUrl: undefined,
  established: 0, // N/A
  regulatedBy: 'N/A',
  location: 'Portugal',
  detailedDescription: 'Steady Growth Investment Fund is an open-ended, actively managed vehicle designed to deliver stable, long-term returns by blending 70 % bonds, 15 % equities, 10 % gold and 5 % deposits. The bond sleeve spans corporate and government issuers across Portugal, Europe and North America, while equity exposure is achieved via diversified stock indices and ETFs. The portfolio is rebalanced quarterly to navigate market cycles and protect capital. Despite major geopolitical and economic shocks over the past seven years, the strategy has achieved a cumulative 4.14 % gain and currently delivers an annualized return of 7.86 %.',
  geographicAllocation: [
    {
      region: 'Portugal',
      percentage: 60
    },
    {
      region: 'Europe',
      percentage: 15
    },
    {
      region: 'Global',
      percentage: 15
    },
    {
      region: 'USA',
      percentage: 5
    },
    {
      region: 'Other',
      percentage: 5
    }
  ],
  team: [
    {
      name: 'Mark Gomes',
      position: 'Executive Board Member & COO'
    },
    {
      name: 'João Sousa Dias',
      position: 'CRO'
    },
    {
      name: 'João Baptista',
      position: 'Partner, CEO & Co-founder of Spark Capital'
    },
    {
      name: 'Miguel Alpendre',
      position: 'CEO'
    },
    {
      name: 'Carlos Pontes Lopes',
      position: 'CFO'
    },
    {
      name: 'Inês Cunha e Silva',
      position: 'Partner, COO & Co-founder of Spark Capital'
    }
  ],
  documents: [],
  redemptionTerms: {
    frequency: 'Not Available',
    redemptionOpen: false,
    notes: 'Investor units can be repurchased by partners upon request; dividends are distributed annually during divestment.'
  }
};
