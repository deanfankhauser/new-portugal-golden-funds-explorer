import { Fund } from '../../types/funds';

export const crownInvestmentsFund: Fund = {
  id: 'crown-investments-fund',
  name: 'Crown Investments Fund',
  managerName: 'Insight Venture - Sociedade de Capital de Risco, S.A.',
  category: 'Venture Capital',
  tags: ['Venture Capital', 'SMEs', 'Tourism', 'Technology', 'Golden Visa Eligible', 'Portugal', 'Closed Ended'],
  description: 'A closed-end venture capital fund investing primarily in SMEs with high growth potential, focusing on tourism-related sectors and Portuguese companies.',
  detailedDescription: `Crown Investments Fund is a sub-fund of Global Insight, specifically designed to invest in small and medium-sized enterprises (SMEs) with high growth potential, particularly in Portugal's tourism ecosystem.

Investment Focus:
• At least 60% of investments in Portugal or Portuguese subsidiaries abroad
• Tourism-related sectors including hotels, restaurants, travel agencies, digital platforms
• Specialized tourism segments: ecotourism, luxury tourism, cultural tourism
• Tourist transport and related activities
• Companies at growth, restructuring, or internationalization stages
• Innovative early-stage start-ups with tourism connections

Fund Structure:
• Two investment categories with differentiated participation rights
• Category A: €500,000 minimum (Qualified Investors only)
• Category B: €100,000 minimum (Qualified or non-qualified investors)
• Complex performance fee structure rewarding Category B investors in later stages

Distribution Policy:
• Priority return of invested capital to both categories
• Category B benefits from 5% hurdle rate before performance fees
• Stage 1: 37.5% to Cat A, 50% to Cat B, 12.5% to manager
• Stage 2: 15% to Cat A, 80% to Cat B, 5% to manager

The fund is managed by Insight Venture, a CMVM-licensed Portuguese venture capital management company with expertise in private equity across tourism, technology, and innovation-driven businesses. The firm emphasizes active management and rigorous governance policies.`,
  minimumInvestment: 100000, // Category B minimum
  fundSize: 50, // €50M (in millions)
  managementFee: 2.5, // Estimated based on performance fee structure
  performanceFee: 12.5, // Varies by stage, using Stage 1 rate
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 8, // 8 years (extendable)
  returnTarget: "High growth through SME investments",
  fundStatus: 'Open',
  websiteUrl: 'insightventure.com',
  established: 2023,
  regulatedBy: 'CMVM',
  eligibilityBasis: {
    portugalAllocation: 60,
    maturityYears: 8,
    realEstateExposure: 'None',
    managerAttestation: true
  },
  cmvmId: "1877002",
  navFrequency: "Quarterly",
  location: 'Portugal',
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    noticePeriod: undefined,
    earlyRedemptionFee: undefined,
    minimumHoldingPeriod: 96, // 8 years in months
    notes: 'No immediate liquidity. Repayment within 1 year after liquidation. Right of first refusal applies to Category A units.'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 60 },
    { region: 'Europe', percentage: 30 },
    { region: 'Other', percentage: 10 }
  ],
  team: [
    {
      name: 'Insight Venture Management Team',
      position: 'Fund Management',
      bio: 'Portuguese venture capital management company specializing in private equity and venture capital across tourism, technology, and innovation-driven businesses'
    }
  ],
  documents: [
    {
      title: 'Fund Prospectus',
      url: '#'
    },
    {
      title: 'CMVM Registration Documents',
      url: '#'
    },
    {
      title: 'Tourism Investment Strategy',
      url: '#'
    },
    {
      title: 'SME Investment Framework',
      url: '#'
    },
    {
      title: 'Performance Fee Structure Guide',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What are the differences between Category A and Category B investments?',
      answer: 'Category A requires €500,000 minimum (Qualified Investors only) while Category B requires €100,000 (any investor type). They have different performance fee structures, with Category B benefiting from better terms in later distribution stages.'
    },
    {
      question: 'How does the complex performance fee structure work?',
      answer: 'The fund has a two-stage distribution policy. In Stage 1, profits are split 37.5% to Category A, 50% to Category B, and 12.5% to manager. In Stage 2, the split becomes 15% to Category A, 80% to Category B, and 5% to manager, heavily favoring Category B investors.'
    },
    {
      question: 'What types of tourism companies does the fund target?',
      answer: 'The fund focuses on hotels, restaurants, travel agencies, digital tourism platforms, ecotourism, luxury tourism, cultural tourism, and tourist transport companies, particularly those at growth, restructuring, or internationalization stages.'
    },
    {
      question: 'What is the Portuguese investment requirement?',
      answer: 'At least 60% of investments must be in Portugal or Portuguese subsidiaries abroad, with funds allocated to Portuguese operations, ensuring significant exposure to the Portuguese tourism economy.'
    },
    {
      question: 'How does the fund ensure liquidity for investors?',
      answer: 'The fund offers no immediate liquidity but provides repayment within 1 year after liquidation. Category A units have right of first refusal, providing some transferability options.'
    },
    {
      question: 'What regulatory oversight does this fund have?',
      answer: 'The fund is registered with CMVM (Registration: 1877002) and managed by Insight Venture, which is licensed and supervised by the Portuguese Securities Market Commission, ensuring regulatory compliance and investor protection.'
    }
  ]
};