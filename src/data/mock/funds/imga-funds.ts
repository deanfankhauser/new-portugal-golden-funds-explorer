import { Fund } from '../../types/funds';

export const imgaPortugueseCorporateDebtFund: Fund = {
  id: 'imga-portuguese-corporate-debt-fund',
  name: 'IMGA Portuguese Corporate Debt Fund',
  managerName: 'IM Gestão de Ativos (IMGA)',
  managerLogo: undefined, // No logo provided
  category: 'Fixed Income & Digital Assets',
  tags: ['Bonds', 'Golden Visa Eligible', 'Portugal', 'Open Ended', 'Liquid', 'Capital Preservation'],
  description: 'An open-end bond investment fund focusing on corporate debt securities issued predominantly by Portuguese companies, targeting stable returns with controlled risk.',
  detailedDescription: `IMGA Portuguese Corporate Debt Fund is a specialized fixed-income investment vehicle that focuses on Portuguese corporate debt securities, providing investors with exposure to the Portuguese corporate credit market while maintaining strict risk controls.

Investment Strategy:
• At least 80% of assets invested in investment-grade bonds and commercial paper
• Focus on corporate debt securities issued predominantly by Portuguese companies
• Selective exposure to other Eurozone corporate issuers for diversification
• Emphasis on credit analysis and broad diversification across sectors
• Average portfolio maturity maintained between 1-5 years for optimal risk-return balance

Portfolio Characteristics:
• Broad sector diversification across utilities, banking, industrials, and telecommunications
• Investment-grade focus ensuring capital preservation and controlled risk
• Daily pricing and redemption capability providing superior liquidity
• Emphasis on securities with strong credit profiles and stable cash flows

Performance Objectives:
• Generate consistent income above Portuguese sovereign yields
• Focus on capital preservation while outperforming domestic bond indices
• Provide stable returns through economic cycles with controlled volatility
• Leverage IMGA's extensive credit research and analysis capabilities

Geographic Focus:
• Primarily Portugal with deep knowledge of local corporate issuers
• Selective exposure to other Eurozone markets for enhanced diversification
• Focus on companies with strong fundamentals and sustainable business models

The fund is managed by IMGA, one of Portugal's largest investment management companies with over €8 billion in assets under management, backed by the institutional strength of Millennium bcp Group.`,
  minimumInvestment: 100000,
  fundSize: 156, // €156M (in millions)
  managementFee: 1.0, // Estimated for bond fund
  performanceFee: 0, // Typically no performance fee for bond funds
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 0, // Open-end fund
  returnTarget: "Consistent income above Portuguese sovereign yields",
  fundStatus: 'Open',
  websiteUrl: undefined,
  established: 2004,
  regulatedBy: 'CMVM',
  location: 'Portugal',
  redemptionTerms: {
    frequency: 'Daily',
    redemptionOpen: true,
    noticePeriod: 1,
    earlyRedemptionFee: 0,
    minimumHoldingPeriod: 0,
    notes: 'Open-end structure with daily subscription and redemption capability'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 80 },
    { region: 'Eurozone', percentage: 20 }
  ],
  team: [
    {
      name: 'IMGA Fixed Income Team',
      position: 'Portfolio Management',
      bio: 'Experienced fixed income professionals with decades of expertise in Portuguese corporate credit markets and rigorous credit analysis'
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
      title: 'Corporate Credit Strategy',
      url: '#'
    },
    {
      title: 'Portfolio Holdings Report',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What makes this fund suitable for conservative investors?',
      answer: 'The fund focuses on investment-grade bonds and commercial paper with at least 80% allocation, maintains 1-5 year average maturity, and emphasizes capital preservation while providing stable income above sovereign yields.'
    },
    {
      question: 'How does the fund provide daily liquidity?',
      answer: 'As an open-end fund, it offers daily pricing and redemption capabilities, allowing investors to subscribe or redeem their holdings on any business day with transparent NAV calculations.'
    },
    {
      question: 'What sectors does the fund invest in?',
      answer: 'The fund maintains broad sector diversification across utilities, banking, industrials, and telecommunications, focusing on Portuguese companies with strong credit profiles and stable cash flows.'
    },
    {
      question: 'Is this fund eligible for Portugal Golden Visa?',
      answer: 'Yes, the fund is eligible for the Portuguese Golden Visa investment route with a minimum investment of €100,000, providing a liquid option for Golden Visa applicants.'
    },
    {
      question: 'What is IMGA\'s experience in managing fixed income funds?',
      answer: 'IMGA is one of Portugal\'s largest investment management companies with over €8 billion in assets under management, backed by Millennium bcp Group, with decades of experience in Portuguese corporate credit markets.'
    }
  ]
};

export const imgaSilverDomusFund: Fund = {
  id: 'imga-silver-domus-fund',
  name: 'IMGA Silver Domus Fund',
  managerName: 'IM Gestão de Ativos (IMGA)',
  managerLogo: undefined, // No logo provided
  category: 'Real Estate',
  tags: ['Real Estate', 'Golden Visa Eligible', 'Portugal', 'Open Ended', 'Dividends'],
  description: 'An open-end real estate fund specializing in senior living and long-term rental residential assets in Portugal, targeting demographic demand drivers.',
  detailedDescription: `IMGA Silver Domus Fund is a specialized real estate investment vehicle that capitalizes on Portugal's demographic trends, focusing on senior living and long-term rental residential assets in high-demand markets.

Investment Strategy:
• Specializes in senior living facilities and long-term rental residential properties
• Targets assets with strong demographic demand drivers, particularly aging population trends
• Focus on fully permitted, income-generating properties with established operations
• Long-term lease agreements with experienced operators ensuring stable cash flows
• Blend of stabilized income assets and value-add opportunities for capital appreciation

Geographic Focus:
• Predominantly Lisbon, Porto, and Algarve - Portugal's highest-demand real estate markets
• Strategic positioning in areas with strong demographic fundamentals
• Focus on locations with excellent transportation links and healthcare infrastructure
• Target markets with limited supply and strong rental demand

Portfolio Characteristics:
• Fully permitted properties with all necessary licenses and approvals
• Income-generating assets with established tenant bases
• Long-term lease agreements providing stable and predictable cash flows
• Professional property management through experienced operators
• Focus on assets benefiting from Portugal's aging population demographics

Performance Objectives:
• Generate stable rental yields with potential for capital appreciation
• Benefit from demographic tailwinds driving demand for senior living facilities
• Provide diversified real estate exposure across Portugal's premier markets
• Deliver consistent returns through economic cycles with quarterly liquidity

ESG & Social Impact:
• Addressing Portugal's aging population housing needs
• Supporting quality senior living facilities and services
• Contributing to sustainable urban development
• Creating employment in local communities

The fund leverages IMGA's extensive real estate expertise and institutional infrastructure, backed by Millennium bcp Group's market knowledge and financial strength.`,
  minimumInvestment: 500000,
  fundSize: 200, // €200M+ (in millions)
  managementFee: 1.5, // Estimated for real estate fund
  performanceFee: 10, // Estimated performance fee
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 0, // Open-end fund
  returnTarget: "Stable rental yields with capital appreciation from demographic tailwinds",
  fundStatus: 'Open',
  websiteUrl: undefined,
  established: 2010,
  regulatedBy: 'CMVM',
  location: 'Portugal',
  redemptionTerms: {
    frequency: 'Quarterly',
    redemptionOpen: true,
    noticePeriod: 30,
    earlyRedemptionFee: 0,
    minimumHoldingPeriod: 0,
    notes: 'Open-end fund with quarterly liquidity windows. NAV calculated quarterly and independently verified.'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 100 }
  ],
  team: [
    {
      name: 'IMGA Real Estate Team',
      position: 'Portfolio Management',
      bio: 'Experienced real estate professionals with deep knowledge of Portuguese property markets, senior living sector, and demographic investment trends'
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
      title: 'Real Estate Investment Strategy',
      url: '#'
    },
    {
      title: 'Portfolio Property Overview',
      url: '#'
    },
    {
      title: 'Demographic Analysis Report',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'Why focus on senior living and rental properties?',
      answer: 'Portugal has a rapidly aging population creating strong demographic demand for quality senior living facilities. Combined with rental housing demand in prime markets, this creates stable, long-term investment opportunities.'
    },
    {
      question: 'Which geographic markets does the fund target?',
      answer: 'The fund focuses predominantly on Lisbon, Porto, and Algarve - Portugal\'s highest-demand and highest-value real estate markets with strong demographic fundamentals and limited supply.'
    },
    {
      question: 'How does the fund ensure stable cash flows?',
      answer: 'The fund targets fully permitted, income-generating properties with long-term lease agreements and experienced operators, providing predictable rental income and professional property management.'
    },
    {
      question: 'What are the liquidity options for this real estate fund?',
      answer: 'As an open-end fund, it offers quarterly liquidity windows with NAV calculated quarterly and independently verified, providing more liquidity than traditional real estate investments.'
    },
    {
      question: 'Is this fund Golden Visa eligible?',
      answer: 'Yes, the fund is Golden Visa compliant with a minimum investment of €500,000, offering real estate exposure through a regulated fund structure rather than direct property ownership.'
    },
    {
      question: 'What is IMGA\'s track record in real estate?',
      answer: 'IMGA manages over €8 billion in assets and has extensive experience in Portuguese real estate markets, backed by Millennium bcp Group\'s institutional infrastructure and market knowledge.'
    }
  ]
};