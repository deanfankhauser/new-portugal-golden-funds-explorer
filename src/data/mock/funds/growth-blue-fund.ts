
import { Fund } from '../../types/funds';

export const growthBlueFund: Fund = {
  id: 'growth-blue-fund',
  name: 'Growth Blue Fund',
  description: 'Closed-ended private equity fund targeting profitable SMEs and mid-caps in the "Blue Economy," with €28 m anchor commitment from the European Investment Fund and eligibility for the Portuguese Golden Visa (minimum €100 000 investment).',
  tags: [
    'Golden Visa Eligible',
    'Private Equity',
    'SMEs',
    'Mid-Cap',
    'Sustainability',
    'Closed Ended',
  ],
  category: 'Private Equity',
  minimumInvestment: 100000,
  fundSize: 50,
  managementFee: 2.0,
  performanceFee: 20,
  term: 10,
  managerName: 'Growth Partners Capital, S.A.',
  returnTarget: 'IRR > 20% & > 3.3× MoM',
  fundStatus: 'Closed',
  established: 2024,
  regulatedBy: 'CMVM (Portuguese Securities Market Commission)',
  location: 'Portugal',
  detailedDescription: 'Growth Blue Fund, managed by Growth Partners Capital, is the only European private equity vehicle dedicated to sustainable ocean-resource businesses ("Blue Economy"), targeting profitable SMEs and mid-caps via growth and build-up strategies. With more than 85% of capital invested in Portugal and backed by a €28 m EIF anchor commitment, the fund combines rigorous due diligence, downside-protection deal structures (dividend preference, anti-dilution), and active portfolio management to achieve an IRR above 20% and 3.3× MoM over a ten-year horizon. The strategy emphasizes ESG integration, sector and geographic diversification, and a clear exit roadmap within a 5-year investment period followed by a 5-year harvest period.',
  geographicAllocation: [
    {
      region: 'Portugal',
      percentage: 85
    },
    {
      region: 'Other',
      percentage: 15
    }
  ],
  team: [
    {
      name: 'José María Cantero de Montes-Jovellar',
      position: 'Chairman & Managing Partner, GP Capital'
    },
    {
      name: 'Juan José Rodríguez Navarro',
      position: 'Board Member & Managing Partner, Growth Blue'
    },
    {
      name: 'Miguel Herédia',
      position: 'Board Member & Managing Partner, Growth Blue'
    },
    {
      name: 'Gonçalo Freire',
      position: 'Associate'
    },
    {
      name: 'Francisco Dias Lopes',
      position: 'Associate'
    },
    {
      name: 'Henrique Simão',
      position: 'Senior Analyst'
    },
    {
      name: 'Tomás de Almeida',
      position: 'Financial Manager'
    },
    {
      name: 'Carla Rodrigues',
      position: 'Financial Assistant'
    }
  ],
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    minimumHoldingPeriod: 120, // 10 years in months
    notes: 'Capital is locked for the 10-year term; no secondary repurchase mechanism.'
  }
};
