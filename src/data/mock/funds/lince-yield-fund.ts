
import { Fund } from '../../types/funds';

export const linceYieldFund: Fund = {
  id: 'lince-yield-fund',
  name: 'Lince Yield Fund, FCR',
  description: 'Open-ended FCR vehicle targeting profitable Portuguese SMEs via senior secured and mezzanine debt, plus hybrid instruments, to deliver stable 5 % p.a. dividends and structured for Portuguese Golden Visa eligibility (minimum €100 000)',
  tags: [
    'Golden Visa Eligible',
    'Debt',
    'Hybrid',
    'SMEs',
    'Liquid',
    'Low Risk',
    'Secondary Market',
    'Diversified',
    'Dividends',
    '5 % Yield'
  ],
  category: 'Private Debt & Hybrid Instruments',
  minimumInvestment: 100000,
  fundSize: 20, // in EUR millions
  managementFee: 2,
  performanceFee: 20,
  subscriptionFee: 0,
  redemptionFee: 0,
  term: 6, // years
  managerName: 'Lince Capital, SCR, S.A.',
  returnTarget: '5% p.a. stable dividends',
  fundStatus: 'Open',
  established: 2025,
  regulatedBy: 'CMVM (license PT.135.267)',
  location: 'Portugal',
  detailedDescription: 'Lince Yield Fund is designed to generate a dependable 5 % p.a. yield by financing profitable Portuguese SMEs through a mix of senior secured loans, second-lien debt, mezzanine instruments and selected hybrids. The strategy emphasizes capital preservation and downside protection via rigorous covenants, high-quality collateral and sector diversification. Investors receive annual dividends commencing in 2026, with full capital reimbursement by year 5, and may trade participation units on the secondary market at any time.',
  geographicAllocation: [
    {
      region: 'Portugal',
      percentage: 100
    }
  ],
  team: [
    {
      name: 'Vasco Pereira Coutinho',
      position: 'CEO & Founding Partner'
    },
    {
      name: 'Lourenço Mayer',
      position: 'Head of Growth Funds'
    },
    {
      name: 'Afonso Pinheiro',
      position: 'Managing Partner (Omnium Advisory)'
    },
    {
      name: 'António Caleia',
      position: 'Founding Partner (Omnium Advisory)'
    },
    {
      name: 'Francisco Formigal Pinto',
      position: 'Managing Partner (Omnium Advisory)'
    },
    {
      name: 'Tomás Lavin Peixe',
      position: 'Head of Innovation Funds'
    }
  ],
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    minimumHoldingPeriod: 72, // 6 years in months
    notes: 'Investors may sell participation units at any time on the secondary market without penalty'
  }
};
