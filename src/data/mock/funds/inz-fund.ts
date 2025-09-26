import { Fund } from '../../types/funds';

export const inzFund: Fund = {
  id: 'inz-fund',
  name: 'INZ Fund',
  managerName: 'STAG Fund Management SCR, S.A.',
  category: 'Private Equity',
  tags: ['Private Equity', 'Renewable Energy', 'Solar', 'Golden Visa Eligible', 'Portugal', 'Closed Ended'],
  description: 'A Golden Visa–eligible private equity vehicle investing in companies that finance and operate solar panel projects, focusing on stable returns from long-term lease agreements and power purchase agreements.',
  detailedDescription: `The INZ Fund is a specialized renewable energy investment vehicle that provides exposure to Portugal's growing solar energy sector through a unique financing and operational model.

Investment Strategy:
• Invests in companies that finance and operate solar panel installations
• Focus on long-term PPAs (Power Purchase Agreements) and lease agreements with creditworthy counterparties
• Revenue streams from interest, dividends, and eventual buy-back from operating companies
• Diversified portfolio across residential and corporate customers in Portugal
• Avoids exposure to energy tariff volatility through fixed-price agreements

Risk Mitigation Framework:
• No Tariff Risk: Fixed-price agreements insulate from energy market volatility
• Diversification: Spread across multiple counterparties and sectors
• Due Diligence: All buyers vetted for creditworthiness
• Real Assets: Tangible, insured solar panels with 25-year guarantees
• Stable Cash Flows: Predictable revenue streams from long-term contracts

Portfolio Example:
• Bling Solutions I, S.A. – Portuguese solar energy company (30% equity stake, active since 2024)

The fund is managed by STAG Fund Management SCR, S.A., an independent Portuguese private equity firm managing 19 funds with €400+ million in combined assets and over 150 years of combined team experience. STAG has completed multiple renewable energy transactions with aggregate deal values exceeding €1.4 billion.`,
  minimumInvestment: 500000,
  fundSize: 50, // €50M target (in millions)
  managementFee: 2.0, // Estimated standard rate
  performanceFee: 20, // Estimated standard rate
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 8, // ~8 years forecasted exit
  returnTarget: "8% per year, 1.64x target multiple",
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
    notes: 'Forecasted exit and capital recovery after ~8 years. Annual cash distributions with 8% yield target.'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 100 }
  ],
  team: [
    {
      name: 'António Pereira',
      position: 'Partner / COO',
      bio: 'Co-founder and partner of STAG post-2023 MBO. Oversees finance and HR with background in investment compliance and private wealth management'
    },
    {
      name: 'Diogo Saraiva Ponte',
      position: 'Partner / CIO',
      bio: 'Partner since 2023 MBO overseeing investor relations and business development. Managed over €2 billion in assets globally'
    },
    {
      name: 'Gisela Martins',
      position: 'Board Member',
      bio: 'Board member since 2021 heading legal and compliance. 20+ years experience in M&A, joint ventures, and private equity'
    },
    {
      name: 'Nathan Hellmann',
      position: 'Director of Business Development',
      bio: '10+ years in investment management and corporate structuring, leading global client engagement across institutional and private markets'
    },
    {
      name: 'Sofia Halpern',
      position: 'Investment Analyst',
      bio: 'Double degree in management and Master\'s in accounting, taxation, and corporate finance. Started at Deloitte in real estate financial due diligence'
    }
  ],
  documents: [
    {
      title: 'Fund Prospectus',
      url: '#'
    },
    {
      title: 'Renewable Energy Investment Strategy',
      url: '#'
    },
    {
      title: 'Solar Portfolio Overview',
      url: '#'
    },
    {
      title: 'Golden Visa Compliance Documentation',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'How does the fund avoid tariff risk in renewable energy investments?',
      answer: 'The fund invests in companies with fixed-price long-term agreements (PPAs and leases) rather than direct energy generation, insulating investors from energy market volatility and tariff changes.'
    },
    {
      question: 'What makes the solar assets secure?',
      answer: 'All solar panels are insured tangible assets with 25-year guarantees, providing physical collateral for investments. The fund also conducts thorough due diligence on all counterparties for creditworthiness.'
    },
    {
      question: 'How does STAG\'s experience benefit this fund?',
      answer: 'STAG manages 19 funds with €400+ million in assets and has completed renewable energy transactions exceeding €1.4 billion in aggregate deal value, providing deep sector expertise and operational knowledge.'
    },
    {
      question: 'What is the expected cash flow structure?',
      answer: 'The fund targets annual cash distributions with an 8% yield, providing regular income to investors while building toward the 1.64x target multiple over the ~8-year investment horizon.'
    },
    {
      question: 'Can you provide an example of a portfolio company?',
      answer: 'Bling Solutions I, S.A. is a Portuguese solar energy company in which the fund holds a 30% equity stake. The investment has been active since 2024 and represents the fund\'s approach to financing solar operations.'
    },
    {
      question: 'Is this fund suitable for Golden Visa applications?',
      answer: 'Yes, the INZ Fund is fully compliant with Portugal Golden Visa requirements as a non-real estate private equity fund with a minimum investment of €500,000.'
    }
  ]
};