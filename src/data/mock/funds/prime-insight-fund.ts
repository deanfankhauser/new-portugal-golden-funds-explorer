import { Fund } from '../../types/funds';

export const primeInsightFund: Fund = {
  id: 'prime-insight-fund',
  name: 'Prime Insight Fund',
  managerName: 'Insight Venture - Sociedade de Capital de Risco, S.A.',
  managerLogo: undefined, // No logo provided
  category: 'Venture Capital',
  tags: ['Venture Capital', 'Real Estate', 'Tourism', 'Infrastructure', 'Renewable Energy', 'Golden Visa Eligible', 'Portugal', 'Closed Ended'],
  description: 'A closed-end venture capital fund focused on prime asset-backed opportunities in Portugal\'s real economy, including real estate development, tourism infrastructure, and renewable energy.',
  detailedDescription: `Prime Insight Fund is a sub-fund of Global Insight, specifically designed to invest in prime asset-backed opportunities within Portugal's real economy, combining stable income-producing assets with capital appreciation potential.

Investment Focus:
• At least 60% of investments in Portuguese companies or subsidiaries abroad that directly contribute to Portugal's economic growth
• Real estate development (non-Golden Visa residential projects)
• Tourism infrastructure including hotels, resorts, and marinas
• Logistics hubs and industrial parks supporting economic development
• Renewable energy generation projects with long-term contracts
• Focus on assets with stable income streams and capital appreciation potential

Portfolio Characteristics:
• Diversified portfolio of 6-10 projects with low correlation between sectors
• Preference for projects with pre-secured licenses, permits, and feasibility studies
• Emphasis on reducing execution risk through thorough due diligence
• Partnerships with established developers and operators with proven track records
• Combination of income-producing assets and growth opportunities

Fund Structure:
• Two investment categories with differentiated participation rights
• Category A: €500,000 minimum (Qualified Investors only) - ISIN: PTIGHDIM0008
• Category B: €100,000 minimum (Qualified or non-qualified investors) - ISIN: PTIGHEIM0007
• Performance fee structure favoring Category B investors in later distribution phases

Exit Strategy:
• Asset sales to institutional buyers seeking stable real economy investments
• Long-term lease agreements followed by strategic asset sales
• Direct sales to operators seeking turnkey infrastructure assets
• Portfolio company IPOs for larger infrastructure projects

The fund leverages Insight Venture's expertise in structuring and managing alternative investment funds, with emphasis on active management and rigorous governance policies to ensure optimal returns from real economy investments.`,
  minimumInvestment: 100000, // Category B minimum
  fundSize: 50, // €50M (in millions)
  managementFee: 2.5, // Estimated based on performance fee structure
  performanceFee: 12.5, // Varies by phase, using Phase 1 rate
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 8, // 8 years (extendable)
  returnTarget: "Stable income plus capital appreciation from real economy assets",
  fundStatus: 'Open',
  websiteUrl: 'insightventure.com',
  established: 2023,
  regulatedBy: 'CMVM',
  location: 'Portugal',
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    noticePeriod: undefined,
    earlyRedemptionFee: undefined,
    minimumHoldingPeriod: 96, // 8 years in months
    notes: 'Closed-end with no early redemption. Fund liquidation and distribution within 1 year after maturity.'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 60 },
    { region: 'Europe', percentage: 30 },
    { region: 'Other', percentage: 10 }
  ],
  team: [
    {
      name: 'Insight Venture Real Economy Team',
      position: 'Fund Management',
      bio: 'Specialized team within Insight Venture focusing on asset-backed investments, real estate development, tourism infrastructure, and renewable energy projects'
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
      title: 'Real Economy Investment Strategy',
      url: '#'
    },
    {
      title: 'Asset-Backed Portfolio Framework',
      url: '#'
    },
    {
      title: 'Infrastructure Development Guidelines',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What types of real economy assets does the fund target?',
      answer: 'The fund focuses on real estate development (non-Golden Visa residential), tourism infrastructure (hotels, resorts, marinas), logistics hubs, industrial parks, and renewable energy generation projects - all with stable income potential.'
    },
    {
      question: 'How does the fund reduce investment risk in real economy projects?',
      answer: 'The fund prioritizes projects with pre-secured licenses, permits, and completed feasibility studies. It partners with established developers and operators, maintaining a diversified portfolio of 6-10 projects with low correlation between sectors.'
    },
    {
      question: 'What are the expected exit strategies for asset-backed investments?',
      answer: 'Expected exit routes include asset sales to institutional buyers, long-term lease agreements followed by asset sales, direct sales to operators seeking turnkey infrastructure, and potential IPOs for larger infrastructure projects.'
    },
    {
      question: 'How does this fund differ from traditional real estate funds?',
      answer: 'Prime Insight Fund combines multiple real economy sectors (real estate, tourism, logistics, renewable energy) to create diversification and targets both stable income and capital appreciation rather than pure real estate exposure.'
    },
    {
      question: 'What is the Portuguese economic contribution requirement?',
      answer: 'At least 60% of investments must be in Portuguese companies or their subsidiaries abroad that directly contribute to Portugal\'s economic growth, ensuring significant positive impact on the Portuguese economy.'
    },
    {
      question: 'How does the two-phase distribution waterfall work?',
      answer: 'Phase 1 distributes 37.5% to Category A, 50% to Category B, and 12.5% to manager. Phase 2 heavily favors Category B with 80% distribution, while Category A receives 15% and manager receives 5%, rewarding long-term Category B investors.'
    }
  ]
};