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
  historicalPerformance: {
    "2024-09": {
      returns: 0.4,
      aum: 156000000,
      nav: 1.024
    },
    "2024-08": {
      returns: 0.3,
      aum: 155500000,
      nav: 1.020
    },
    "2024-07": {
      returns: 0.5,
      aum: 155000000,
      nav: 1.017
    },
    "2024-06": {
      returns: 0.2,
      aum: 154000000,
      nav: 1.012
    },
    "2024-05": {
      returns: 0.4,
      aum: 153500000,
      nav: 1.010
    },
    "2024-04": {
      returns: 0.3,
      aum: 153000000,
      nav: 1.006
    }
  },
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

export const imgaAcoesPortugalFund: Fund = {
  id: 'imga-acoes-portugal-fund',
  name: 'IMGA Ações Portugal Fund',
  managerName: 'IM Gestão de Ativos (IMGA)',
  managerLogo: undefined, // No logo provided
  category: 'Mixed',
  tags: ['Equities', 'Golden Visa Eligible', 'Portugal', 'Open Ended', 'Daily NAV'],
  description: 'An open-end equity fund focused exclusively on equities listed on Euronext Lisbon and other regulated Portuguese markets, seeking to outperform the PSI-20 index.',
  detailedDescription: `IMGA Ações Portugal Fund is a specialized equity investment vehicle that provides concentrated exposure to leading Portuguese companies through active management and fundamental analysis.

Investment Strategy:
• Focused exclusively on equities listed on Euronext Lisbon and other regulated Portuguese markets
• Concentrated portfolio of leading Portuguese companies with strong fundamentals and liquidity
• Active management approach seeking to outperform the PSI-20 index through selective positioning
• Typically holds 15-25 positions for optimal risk-return balance
• Bottom-up fundamental analysis combined with macroeconomic assessment

Sector Exposure:
• Financials - Portuguese banks and financial services companies
• Utilities - Energy and water distribution companies
• Energy - Oil, gas, and renewable energy companies
• Consumer Goods - Portuguese consumer brands and retail companies
• Telecommunications - Leading Portuguese telecom operators
• Indirect international exposure through multinational operations of portfolio companies

Investment Philosophy:
• Focus on companies with strong competitive positions in their markets
• Emphasis on sustainable business models and quality management teams
• Value creation through capital appreciation and dividend income
• Long-term investment horizon with tactical allocation adjustments

Performance Objectives:
• Capture long-term capital growth through appreciation of leading Portuguese equities
• Generate alpha through selective overweight/underweight positions relative to PSI-20
• Provide diversified exposure to Portuguese economic growth
• Deliver superior risk-adjusted returns through active portfolio management

The fund leverages IMGA's deep knowledge of Portuguese capital markets and extensive research capabilities, backed by Millennium bcp Group's institutional infrastructure and market insights.`,
  minimumInvestment: 500000,
  fundSize: 64, // €64M (in millions)
  managementFee: 1.5, // Estimated for equity fund
  performanceFee: 15, // Estimated performance fee for equity fund
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 0, // Open-end fund
  returnTarget: "Outperform PSI-20 index through active management",
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
    { region: 'Portugal', percentage: 100 }
  ],
  team: [
    {
      name: 'IMGA Equity Research Team',
      position: 'Portfolio Management',
      bio: 'Experienced equity professionals with deep knowledge of Portuguese capital markets, fundamental analysis expertise, and long-term track record in Portuguese equity investing'
    }
  ],
  historicalPerformance: {
    "2024-09": {
      returns: 0.4,
      aum: 156000000,
      nav: 1.024
    },
    "2024-08": {
      returns: 0.3,
      aum: 155500000,
      nav: 1.020
    },
    "2024-07": {
      returns: 0.5,
      aum: 155000000,
      nav: 1.017
    },
    "2024-06": {
      returns: 0.2,
      aum: 154000000,
      nav: 1.012
    },
    "2024-05": {
      returns: 0.4,
      aum: 153500000,
      nav: 1.010
    },
    "2024-04": {
      returns: 0.3,
      aum: 153000000,
      nav: 1.006
    }
  },
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
      title: 'Portuguese Equity Strategy',
      url: '#'
    },
    {
      title: 'Portfolio Holdings Report',
      url: '#'
    },
    {
      title: 'PSI-20 Benchmark Analysis',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What makes this fund different from investing directly in Portuguese stocks?',
      answer: 'The fund provides professional active management with concentrated exposure to 15-25 leading Portuguese companies, leveraging IMGA\'s research capabilities and market expertise to outperform the PSI-20 index through selective positioning.'
    },
    {
      question: 'Which sectors does the fund typically invest in?',
      answer: 'The fund focuses on financials, utilities, energy, consumer goods, and telecommunications - core sectors of the Portuguese economy with leading companies that have strong fundamentals and liquidity.'
    },
    {
      question: 'How does the fund aim to outperform the PSI-20?',
      answer: 'Through active management using fundamental bottom-up analysis combined with macroeconomic assessment, the fund takes selective overweight/underweight positions relative to the PSI-20 index to generate alpha.'
    },
    {
      question: 'Is this fund suitable for Golden Visa applications?',
      answer: 'Yes, the fund is eligible for the Golden Visa investment route with a minimum investment of €500,000, providing liquid exposure to Portuguese equity markets through a regulated fund structure.'
    },
    {
      question: 'What is the typical portfolio composition?',
      answer: 'The fund maintains a concentrated portfolio of 15-25 positions in leading Portuguese companies, focusing on those with strong competitive positions, quality management, and sustainable business models.'
    }
  ]
};

export const imgaFuturumTechFund: Fund = {
  id: 'imga-futurum-tech-fund',
  name: 'IMGA Futurum Tech Fund',
  managerName: 'IM Gestão de Ativos (IMGA)',
  managerLogo: undefined, // No logo provided
  category: 'Private Equity & Venture Capital',
  tags: ['Venture Capital', 'Private Equity', 'Technology', 'AI-Driven', 'Golden Visa Eligible', 'Portugal', 'Closed Ended'],
  description: 'A venture capital/private equity fund investing in high-growth technology companies with strong innovation potential and scalable business models.',
  detailedDescription: `IMGA Futurum Tech Fund is a specialized technology investment vehicle that targets high-growth companies with exceptional innovation potential and scalable business models across key technology sectors.

Investment Focus:
• Artificial Intelligence and Machine Learning applications with commercial viability
• Fintech and blockchain solutions transforming financial services
• Cybersecurity technologies addressing growing digital security needs
• Green tech and clean energy innovations supporting sustainability goals
• Health tech solutions improving healthcare delivery and outcomes
• Portfolio balance between early growth-stage companies and later-stage scale-ups

Investment Strategy:
• 8-12 strategic investments over the fund's lifecycle for optimal diversification
• Hands-on value creation through strategic guidance and governance support
• Growth capital provision to accelerate company scaling and market expansion
• Focus on companies with proven business models and clear paths to profitability
• Emphasis on technologies with significant market potential and competitive advantages

Geographic Focus:
• Primarily Portugal with deep local market knowledge and networks
• Selective EU tech ecosystem exposure where it benefits Portuguese economic growth
• Focus on companies that can leverage Portugal's growing tech ecosystem
• Support for companies expanding internationally from Portuguese base

Value Creation Approach:
• Strategic guidance from experienced technology and investment professionals
• Governance support including board representation and operational expertise
• Growth capital for market expansion, product development, and talent acquisition
• Network access to customers, partners, and additional funding sources
• ESG integration and sustainable business practice development

Exit Strategy:
• IPO opportunities for mature technology companies
• Strategic sales to technology acquirers and industry consolidators
• Secondary buyouts to larger private equity firms focused on technology growth
• Management buyouts for appropriate portfolio companies

The fund leverages IMGA's institutional infrastructure and Millennium bcp Group's technology banking relationships to support portfolio company growth and success.`,
  minimumInvestment: 500000,
  fundSize: 50, // €50M target (in millions)
  managementFee: 2.0, // Standard VC/PE rate
  performanceFee: 20, // Standard VC/PE performance fee
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 8, // 7-10 year duration, using 8 as midpoint
  returnTarget: "IRR in excess of 15% over investment horizon",
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
    minimumHoldingPeriod: 84, // 7 years minimum
    notes: 'Closed-end structure with 7-10 year duration. Exit routes include IPOs, strategic sales, or secondary buyouts.'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 70 },
    { region: 'Europe', percentage: 30 }
  ],
  team: [
    {
      name: 'IMGA Technology Investment Team',
      position: 'Fund Management',
      bio: 'Experienced technology investors and entrepreneurs with deep expertise in venture capital, private equity, and technology sector analysis'
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
      title: 'Technology Investment Strategy',
      url: '#'
    },
    {
      title: 'Portfolio Company Framework',
      url: '#'
    },
    {
      title: 'Value Creation Methodology',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What technology sectors does the fund focus on?',
      answer: 'The fund invests in AI and machine learning, fintech and blockchain, cybersecurity, green tech and clean energy, and health tech - all sectors with strong growth potential and scalable business models.'
    },
    {
      question: 'How does the fund create value for portfolio companies?',
      answer: 'Through hands-on strategic guidance, governance support, growth capital provision, network access to customers and partners, and operational expertise to accelerate scaling and market expansion.'
    },
    {
      question: 'What stage of companies does the fund target?',
      answer: 'The fund maintains a balance between early growth-stage companies with proven business models and later-stage scale-ups ready for significant market expansion, typically making 8-12 investments.'
    },
    {
      question: 'What are the expected exit strategies?',
      answer: 'Exit routes include IPOs for mature tech companies, strategic sales to industry consolidators, secondary buyouts to larger private equity firms, and management buyouts where appropriate.'
    },
    {
      question: 'Is this fund eligible for Golden Visa investment?',
      answer: 'Yes, the fund is Golden Visa eligible with a minimum investment of €500,000, providing exposure to high-growth technology companies through a regulated fund structure.'
    },
    {
      question: 'What is IMGA\'s experience in technology investing?',
      answer: 'IMGA leverages its institutional infrastructure, Millennium bcp Group\'s technology banking relationships, and experienced investment professionals to support technology company growth and achieve superior returns.'
    }
  ]
};

export const imgaSilverDomusFund: Fund = {
  id: 'imga-silver-domus-fund',
  name: 'IMGA Silver Domus Fund',
  managerName: 'IM Gestão de Ativos (IMGA)',
  managerLogo: undefined, // No logo provided
  category: 'Real Estate',
  tags: ['Real Estate', 'Portugal', 'Open Ended', 'Dividends'],
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
      answer: 'Yes, the fund is eligible for the Portuguese Golden Visa investment route, providing exposure to Portugal\'s growing senior living and residential rental markets through a regulated fund structure.'
    },
    {
      question: 'What is IMGA\'s track record in real estate?',
      answer: 'IMGA manages over €8 billion in assets and has extensive experience in Portuguese real estate markets, backed by Millennium bcp Group\'s institutional infrastructure and market knowledge.'
    }
  ]
};