
import { Fund } from '../../types/funds';

export const linceGrowthFund: Fund = {
  id: 'lince-growth-fund',
  name: 'Lince Growth Fund I, FCR',
  description: 'Closed-ended venture capital and private equity fund targeting growth and consolidation of Portuguese industrial and circular-economy SMEs via equity, hybrid and debt instruments, structured to satisfy Golden Visa requirements.',
  tags: [
    'Golden Visa Eligible',
    'Private Equity',
    'Venture Capital',
    'Industrial',
    'Circular Economy',
    'Equity',
    'Debt',
    'Special Situations',
    'Secondary Market',
    'Long Term'
  ],
  category: 'Private Equity & Venture Capital',
  minimumInvestment: 100000,
  fundSize: 20, // in EUR millions
  managementFee: 2,
  performanceFee: 20,
  subscriptionFee: 3,
  term: 7, // years
  managerName: 'Lince Capital, SCR, S.A.',
  returnTarget: '15-20% p.a.',
  fundStatus: 'Open',
  established: 2025,
  regulatedBy: 'CMVM (Portuguese Securities Market Commission)',
  location: 'Portugal',
  detailedDescription: 'Lince Growth Fund I is a closed-ended FCR vehicle designed for non-EU investors seeking Portuguese residency through the Golden Visa program. The fund targets small-to-mid-cap industrial and circular-economy businesses, deploying €1.5 m–€5 m tickets via equity, hybrids and secured debt to balance upside potential with downside protection. Leveraging Lince Capital\'s 30+ years of experience and Omnium Advisory\'s deal-sourcing network, the strategy emphasizes operational improvements, export growth and ESG integration. Investors benefit from a 3 % one-off setup fee, 2 % p.a. management fee, and 20 % carry above a 5 % IRR hurdle. Units carry a 7-year maturity, with distributions from year 3 and a secondary-market exit option thereafter. The fund aims for a 15–20 % annualized return, fully aligning with residency requirements.',
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
      position: 'Founding Partner, Omnium Advisory'
    },
    {
      name: 'Francisco Formigal Pinto',
      position: 'Managing Partner, Omnium Advisory'
    },
    {
      name: 'Tomás Lavin Peixe',
      position: 'Head of Innovation Funds'
    }
  ],
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    minimumHoldingPeriod: 84, // 7 years in months
    notes: 'Investors may sell participation units to Lince Capital, private investors or specialized funds; expected capital distributions from year 3 with full return by maturity.'
  }
};
