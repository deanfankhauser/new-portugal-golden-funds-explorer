import { Fund } from '../../types/funds';

export const flexSpaceFund: Fund = {
  id: 'flex-space-fund',
  name: 'Flex Space Fund',
  managerName: 'Insula Capital SGOIC',
  category: 'Private Equity',
  tags: ['Private Equity', 'Real Estate', 'Golden Visa Eligible', 'Dividends', 'Portugal', 'Closed Ended'],
  description: 'A CMVM-regulated, closed-end private equity fund investing exclusively in district.space, a Portuguese flex office operator, targeting an underdeveloped market with strong demand and guaranteed exit.',
  detailedDescription: `The Flex Space Fund is a specialized private equity fund that capitalizes on Portugal's undersupplied flex office market. The fund invests 100% in district.space, a Portuguese coworking and flex office brand with strong ESG principles.

Key Investment Highlights:
• Single-asset focus on district.space, a flex office operator with prime Portuguese locations
• Portugal's flex office market represents only 4% of office stock vs. 12% in London, indicating significant growth potential
• First location in Setúbal reached 70% occupancy within months of opening in October 2024
• Expansion planned to Braga, Lisbon, and Porto in 2025
• Pre-secured buyer for guaranteed exit strategy
• Annual dividend distributions starting from year 2

The fund benefits from Insula Capital's extensive real estate expertise and €1.5 billion in assets under management across 21 funds. District.space integrates ESG principles into all operations, including partnerships with social enterprises like Café Joyeux.`,
  minimumInvestment: 100000,
  fundSize: 20, // €20M target (in millions)
  managementFee: 1.5,
  performanceFee: 20,
  subscriptionFee: 1000, // €1,000 one-off
  redemptionFee: 0,
  term: 8, // 8 years
  returnTarget: "11.65% IRR",
  fundStatus: 'Open',
  websiteUrl: undefined,
  established: 2024,
  regulatedBy: 'CMVM',
  location: 'Portugal',
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    noticePeriod: undefined,
    earlyRedemptionFee: undefined,
    minimumHoldingPeriod: 96, // 8 years in months
    notes: 'Closed-end fund with 8-year term'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 100 }
  ],
  team: [
    {
      name: 'Insula Capital Team',
      position: 'Fund Management',
      bio: 'Real estate investment and fund management expertise with €1.5 billion in assets under management'
    }
  ],
  documents: [
    {
      title: 'Fund Prospectus',
      url: '#'
    },
    {
      title: 'ESG Policy',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What makes this fund different from traditional real estate funds?',
      answer: 'The Flex Space Fund invests in a flex office operator rather than direct real estate assets, providing exposure to the growing flexible workspace market through an operational business model.'
    },
    {
      question: 'How does the dividend distribution work?',
      answer: 'The fund targets annual dividend distributions of 3.75% starting from year 2, providing regular income to investors alongside capital appreciation.'
    },
    {
      question: 'What is the exit strategy?',
      answer: 'The fund benefits from a pre-secured buyer arrangement, providing a clear exit path at the end of the 8-year term.'
    },
    {
      question: 'Is this fund suitable for Golden Visa applications?',
      answer: 'Yes, the fund is Golden Visa eligible with a minimum investment requirement of €500,000 for Golden Visa applicants.'
    },
    {
      question: 'What ESG initiatives does district.space implement?',
      answer: 'District.space integrates ESG principles including partnerships with social enterprises like Café Joyeux, which employs people with intellectual and developmental disabilities.'
    }
  ]
};