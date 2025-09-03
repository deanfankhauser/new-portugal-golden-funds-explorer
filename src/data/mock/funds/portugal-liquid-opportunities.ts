
import { Fund } from '../../types/funds';

export const portugalLiquidOpportunities: Fund = {
  id: 'portugal-liquid-opportunities',
  name: 'Portugal Liquid Opportunities, FCR',
  description: 'Open-ended, FACTA-compliant public equities vehicle managed by Oxy Capital – SGOIC, S.A., investing over 60% in Portuguese listed equities and under 40% in international equities via Oxy\'s proprietary strategy; perpetual subscriptions with daily liquidity and no redemption fee after three years for Golden Visa investors.',
  tags: [
    'Golden Visa Eligible',
    'Equity',
    'Equities',
    'Liquid',
    'Open Ended',
    'Low Risk',
    'No Fees',
    'Daily NAV',
    'Portugal'
  ],
  category: 'Mixed',
  minimumInvestment: 100000,
  fundSize: 0, // N/A - will be handled in display logic
  managementFee: 1.2,
  performanceFee: 20.0,
  subscriptionFee: 2.0,
  redemptionFee: 0,
  term: 0, // Perpetual fund
  managerName: 'Oxy Capital – SGOIC, S.A.',
  returnTarget: 'Low teens per year (gross)',
  fundStatus: 'Open',
  established: 0, // N/A
  regulatedBy: 'Oxy Capital – SGOIC, S.A. (authorized by CMVM)',
  location: 'Portugal',
  detailedDescription: `Portugal Liquid Opportunities Fund is an open-ended, FACTA-compliant public equities vehicle managed by Oxy Capital – SGOIC, S.A., with a minimum subscription of €100,000. It allocates over 60% of its assets to Portuguese public equities—targeting leading national "champions"—and under 40% to international equities via Oxy's proprietary strategy.

Designed for Golden Visa investors, subscriptions are perpetual with daily liquidity, and no redemption fee applies after three years. The fund targets low-teens gross annual returns, with all costs deducted from invested capital.

Key features include:
• Open-ended structure with perpetual subscriptions
• Daily liquidity with daily NAV calculation
• FACTA-compliant for international investors
• Over 60% allocation to Portuguese public equities
• Under 40% allocation to international equities
• No redemption fee after year 3
• 5% IRR hurdle rate for performance fees`,
  geographicAllocation: [
    { region: 'Portugal', percentage: 65 },
    { region: 'International', percentage: 35 }
  ],
  team: [
    { name: 'Pedro Sousa', position: 'Head of Portugal Liquid Opportunities' },
    { name: 'Guilherme Valadares Carreiro', position: 'Head of Golden Visa Initiatives' },
    { name: 'Bernardo Gomes', position: 'Co-Head of Golden Visa Initiatives' },
    { name: 'Sofia Lapa', position: 'Investment Team' },
    { name: 'Francisco Resende Faria', position: 'Investment Team' }
  ],
  redemptionTerms: {
    frequency: 'Daily',
    redemptionOpen: true,
    noticePeriod: 0,
    earlyRedemptionFee: 0,
    minimumHoldingPeriod: 0,
    notes: 'Daily NAV; no redemption fee after year 3; all costs deducted from invested capital.'
  },
  faqs: [
    {
      question: 'What is the investment strategy of Portugal Liquid Opportunities Fund?',
      answer: 'The fund allocates over 60% to Portuguese public equities targeting leading national "champions" and under 40% to international equities via Oxy\'s proprietary strategy.'
    },
    {
      question: 'How does this fund qualify for the Portuguese Golden Visa?',
      answer: 'The fund is designed specifically for Golden Visa investors with perpetual subscriptions, daily liquidity, and compliance with Portuguese investment requirements.'
    },
    {
      question: 'What are the redemption terms?',
      answer: 'The fund offers daily liquidity with daily NAV calculation. There is no redemption fee after year 3, making it highly liquid for long-term investors.'
    },
    {
      question: 'What is FACTA compliance?',
      answer: 'FACTA compliance ensures the fund meets international tax reporting requirements, making it suitable for international investors including those from the US.'
    }
  ]
};
