import { Fund } from '../../types/funds';

export const blueWaterCapitalFund: Fund = {
  id: 'bluewater-capital-fund',
  name: 'BlueWater Capital Fund',
  managerName: 'Insight Venture - Sociedade de Capital de Risco, S.A.',
  managerLogo: undefined, // No logo provided
  category: 'Venture Capital',
  tags: ['Venture Capital', 'Infrastructure', 'Sustainability', 'Renewable Energy', 'Golden Visa Eligible', 'Portugal', 'Closed Ended'],
  description: 'A closed-end venture capital fund focusing on marine economy and waterfront-related assets with strong sustainable growth prospects, particularly in Portugal\'s coastal regions.',
  detailedDescription: `BlueWater Capital Fund is a sub-fund of Global Insight, specifically designed to invest in the marine economy and waterfront-related assets that offer sustainable growth prospects and measurable environmental impact.

Investment Focus:
• At least 60% of capital invested in Portugal or Portuguese subsidiaries abroad benefiting the Portuguese economy
• Marinas and yacht harbors with premium positioning
• Coastal and island hospitality projects leveraging Portugal's extensive coastline
• Marine logistics and transport infrastructure supporting trade
• Ocean-based renewable energy initiatives including wave and offshore wind projects
• Aquaculture and sustainable seafood ventures with export potential
• Marine technology & innovation hubs driving blue economy growth

Portfolio Characteristics:
• Diversification across 10-12 investments mixing income-yielding and growth projects
• Strong focus on measurable ESG impacts, particularly marine conservation and coastal community development
• Partnerships with specialist marine operators and developers for operational excellence
• Emphasis on sustainable practices and environmental protection
• Integration of technology and innovation in traditional marine sectors

Fund Structure:
• Two investment categories with differentiated participation rights
• Category A: €500,000 minimum (Qualified Investors only) - ISIN: PTIGHDIM0006
• Category B: €100,000 minimum (Qualified or non-qualified investors) - ISIN: PTIGHEIM0002
• Performance fee structure heavily favoring Category B investors in later distribution stages

ESG & Sustainability:
• Marine conservation initiatives and coastal ecosystem protection
• Sustainable fishing and aquaculture practices
• Renewable ocean energy development
• Coastal community development and employment creation
• Blue economy innovation and technology advancement

Exit Strategy:
• Sales to institutional marine infrastructure investors seeking specialized assets
• REIT acquisitions focused on coastal and marine properties
• Corporate acquisitions by companies expanding marine operations
• Strategic partnerships with international marine economy players

The fund leverages Portugal's 1,794 km coastline and strong maritime heritage, positioning investors to benefit from the growing global blue economy while contributing to sustainable coastal development.`,
  minimumInvestment: 100000, // Category B minimum
  fundSize: 50, // €50M (in millions)
  managementFee: 2.5, // Estimated based on performance fee structure
  performanceFee: 12.5, // Varies by stage, using Stage 1 rate
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 8, // 8 years (extendable)
  returnTarget: "Sustainable growth from marine economy investments",
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
    notes: 'Closed-end structure with no early redemption. Fund liquidation followed by capital distribution within 12 months.'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 60 },
    { region: 'Europe', percentage: 30 },
    { region: 'Other', percentage: 10 }
  ],
  team: [
    {
      name: 'Insight Venture Marine Economy Team',
      position: 'Fund Management',
      bio: 'Specialized team within Insight Venture focusing on marine economy investments, waterfront development, ocean renewable energy, and sustainable coastal projects'
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
      title: 'Marine Economy Investment Strategy',
      url: '#'
    },
    {
      title: 'Blue Economy Portfolio Framework',
      url: '#'
    },
    {
      title: 'ESG & Sustainability Guidelines',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What is the marine economy and why invest in it?',
      answer: 'The marine economy encompasses all economic activities related to oceans, seas, and coasts. Portugal\'s 1,794 km coastline and maritime heritage create significant opportunities in marinas, coastal hospitality, marine logistics, ocean renewables, and sustainable seafood ventures.'
    },
    {
      question: 'What types of marine economy projects does the fund target?',
      answer: 'The fund invests in marinas and yacht harbors, coastal and island hospitality projects, marine logistics and transport, ocean-based renewable energy (wave & offshore wind), aquaculture ventures, and marine technology hubs.'
    },
    {
      question: 'How does the fund ensure environmental sustainability?',
      answer: 'The fund focuses on projects with measurable ESG impacts, particularly marine conservation and coastal community development. All investments must demonstrate positive environmental outcomes and sustainable practices.'
    },
    {
      question: 'What are the expected exit strategies for marine economy investments?',
      answer: 'Exit routes include sales to institutional marine infrastructure investors, REIT acquisitions focused on coastal properties, corporate acquisitions by marine operators, and strategic partnerships with international blue economy players.'
    },
    {
      question: 'How does portfolio diversification work in the marine economy?',
      answer: 'The fund maintains diversification across 10-12 investments with a mix of income-yielding assets (marinas, hospitality) and growth projects (renewables, technology), reducing sector concentration risk while capturing marine economy upside.'
    },
    {
      question: 'What role do specialist marine operators play?',
      answer: 'The fund partners with specialist marine operators and developers to ensure operational excellence. These partnerships provide technical expertise, operational knowledge, and industry connections essential for successful marine economy investments.'
    }
  ]
};