import { Fund } from '../../types/funds';

export const digitalInsightFund: Fund = {
  id: 'digital-insight-fund',
  name: 'Digital Insight Fund',
  managerName: 'Insight Venture - Sociedade de Capital de Risco, S.A.',
  managerLogo: undefined, // No logo provided
  category: 'Venture Capital',
  tags: ['Venture Capital', 'Technology', 'AI-Driven', 'Golden Visa Eligible', 'Portugal', 'Closed Ended'],
  description: 'A closed-end venture capital fund focusing on digital economy and technology-driven businesses with high scalability potential, particularly in Portugal.',
  detailedDescription: `Digital Insight Fund is a sub-fund of Global Insight, specifically designed to invest in the digital economy and technology-driven businesses with exceptional scalability potential and strong competitive positioning.

Investment Focus:
• At least 60% of invested capital in companies in Portugal or Portuguese subsidiaries abroad
• Digital economy sectors including e-commerce platforms, SaaS (Software as a Service)
• AI & Machine Learning applications with commercial viability
• Digital media and content platforms
• Fintech and payment systems innovation
• Edtech and online learning platforms
• Investment stages from growth capital to early-stage start-ups with proven business models

Portfolio Characteristics:
• Diversification across 10-15 companies in different digital subsectors
• Preference for companies with recurring revenue streams and strong intellectual property
• Focus on established user bases and scalable business models
• Co-investment with strategic partners to accelerate scale-up and market penetration

Fund Structure:
• Two investment categories with differentiated participation rights
• Category A: €500,000 minimum (Qualified Investors only) - ISIN: PTIGHAIM0000
• Category B: €100,000 minimum (Qualified or non-qualified investors) - ISIN: PTIGHBIM0009
• Performance fee structure favoring Category B investors in later distribution stages

Exit Strategy:
• Trade sales to strategic acquirers in the technology sector
• IPO opportunities for mature digital platforms
• Secondary sales to private equity firms focused on technology growth

The fund is managed by Insight Venture, a CMVM-licensed Portuguese venture capital management company with deep expertise in technology investments and digital transformation across multiple sectors.`,
  minimumInvestment: 100000, // Category B minimum
  fundSize: 50, // €50M (in millions)
  managementFee: 2.5, // Estimated based on performance fee structure
  performanceFee: 12.5, // Varies by stage, using Stage 1 rate
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 8, // 8 years (extendable)
  returnTarget: "High growth through digital economy investments",
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
    notes: 'Closed-end structure with no early redemption. Fund liquidation followed by capital distribution within 1 year.'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 60 },
    { region: 'Europe', percentage: 30 },
    { region: 'Other', percentage: 10 }
  ],
  team: [
    {
      name: 'Insight Venture Technology Team',
      position: 'Fund Management',
      bio: 'Specialized team within Insight Venture focusing on digital economy investments, technology-driven businesses, and digital transformation initiatives'
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
      title: 'Digital Economy Investment Strategy',
      url: '#'
    },
    {
      title: 'Technology Portfolio Framework',
      url: '#'
    },
    {
      title: 'Performance Fee Structure Guide',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What digital sectors does the fund prioritize?',
      answer: 'The fund focuses on e-commerce platforms, SaaS applications, AI & Machine Learning, digital media and content, fintech and payment systems, and edtech platforms - all with high scalability potential and proven business models.'
    },
    {
      question: 'How does the fund select technology investments?',
      answer: 'The fund prioritizes companies with recurring revenue streams, strong intellectual property, established user bases, and scalable business models. Portfolio diversification across 10-15 companies in different digital subsectors is maintained.'
    },
    {
      question: 'What are the exit strategies for digital investments?',
      answer: 'Targeted exit strategies include trade sales to strategic technology acquirers, IPO opportunities for mature digital platforms, and secondary sales to private equity firms focused on technology growth.'
    },
    {
      question: 'How does the two-category investment structure work?',
      answer: 'Category A requires €500,000 minimum (Qualified Investors) while Category B requires €100,000 (any investor). Both have different ISIN codes and performance fee structures, with Category B receiving more favorable terms in later distribution stages.'
    },
    {
      question: 'What is the Portuguese investment requirement for this digital fund?',
      answer: 'At least 60% of invested capital must be allocated to companies in Portugal or Portuguese subsidiaries abroad with operations that benefit Portugal, ensuring significant exposure to the Portuguese digital economy.'
    },
    {
      question: 'How does the fund accelerate portfolio company growth?',
      answer: 'The fund employs co-investment strategies with strategic partners to accelerate scale-up and market penetration, leveraging industry expertise and networks to maximize portfolio company potential.'
    }
  ]
};