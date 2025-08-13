import { Fund } from '../../types/funds';

export const globalEuropeanCinemaFund: Fund = {
  id: 'global-european-cinema-fund',
  name: 'Global European Cinema Fund (GECF)',
  managerName: 'Quadrantis Capital',
  managerLogo: undefined, // No logo provided
  category: 'Private Equity',
  tags: ['Private Equity', 'Technology', 'Portugal', 'Closed Ended', 'Dividends'],
  description: 'An asset-based, risk-mitigated investment vehicle designed to finance the ongoing production of film and television content with guaranteed worldwide distribution.',
  detailedDescription: `The Global European Cinema Fund is a specialized entertainment investment vehicle that finances high-potential film and television content with commercial viability and guaranteed global distribution through strategic partnerships.

Investment Strategy:
• Invests in multiple entertainment projects from feature films to television series
• All content developed with platform-ready formats for major streaming services (Netflix, Amazon Prime, SkyShowtime)
• Fully owns content until investment recovery
• Secures major talent early to enable presales and mitigate budget risks
• Co-productions with partners in Europe, US, and Latin America

Risk Mitigation Framework:
• Equity ownership in every project until exit
• Collateralized investments with legal title and LLC structures
• Senior debt recovery rights before profit distribution
• Partnerships with established producers and distributors
• Government-backed rebates of 25-30% for funds spent in Portugal

Current Pipeline Projects:
• Aristides – Drama/Biopic (€10M)
• A Máfia e o Bruxo – Thriller/Comedy (€3.5M)
• The Last Romantic Revolutionary Palma Inácio – Thriller/Adventure (€4.5M)
• O Segredo de Lisboa – Thriller/Mystery (€9.6M)
• Um Rio Chamado Tempo – Drama (€2M)
• Carlos Paredes Station – Musical/Biopic (€2M)

The fund benefits from a strategic relationship with VOLF Entertainment, one of Portugal's most successful production companies, ensuring guaranteed worldwide distribution for every project.`,
  minimumInvestment: 200000,
  fundSize: 50, // €50M (in millions)
  managementFee: 1.0,
  performanceFee: 0, // Not mentioned, fixed annual payment structure
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 10, // 10 years (2025-2035)
  returnTarget: "5% fixed annual payment",
  fundStatus: 'Open',
  websiteUrl: undefined,
  established: 2025,
  regulatedBy: 'CMVM',
  location: 'Portugal',
  redemptionTerms: {
    frequency: 'Annual',
    redemptionOpen: false,
    noticePeriod: undefined,
    earlyRedemptionFee: undefined,
    minimumHoldingPeriod: 60, // 5-year investment period
    notes: '5-year investment period followed by 2-year divestment phase. Fixed annual payment of 5%.'
  },
  geographicAllocation: [
    { region: 'Europe', percentage: 70 },
    { region: 'North America', percentage: 20 },
    { region: 'Latin America', percentage: 10 }
  ],
  team: [
    {
      name: 'João Koehler',
      position: 'Managing Partner',
      bio: '15+ years in M&A and private equity; founder of Growth Partners Capital with expertise in deal execution and strategic investment'
    },
    {
      name: 'Pedro Rosas',
      position: 'Partner',
      bio: '25+ years in luxury goods, real estate, and hospitality, with a heritage in fine craftsmanship and deep industry knowledge'
    },
    {
      name: 'Paulo Caetano',
      position: 'Partner',
      bio: '30+ years of experience across VC, M&A, and infrastructure funds globally with expertise in fundraising and strategic investment'
    }
  ],
  documents: [
    {
      title: 'Fund Prospectus',
      url: '#'
    },
    {
      title: 'Entertainment Investment Strategy',
      url: '#'
    },
    {
      title: 'Project Pipeline Overview',
      url: '#'
    },
    {
      title: 'Risk Mitigation Framework',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'How does the fund ensure guaranteed distribution for projects?',
      answer: 'The fund has a strategic relationship with VOLF Entertainment, one of Portugal\'s most successful production companies, which provides guaranteed worldwide distribution for every project in the portfolio.'
    },
    {
      question: 'What is the fixed annual payment structure?',
      answer: 'Investors receive a fixed annual payment of 5% over the 10-year fund life, providing predictable income while participating in the entertainment industry\'s growth potential.'
    },
    {
      question: 'How does the fund mitigate investment risks?',
      answer: 'The fund employs multiple risk mitigation strategies including equity ownership until exit, collateralized investments with legal title, senior debt recovery rights, partnerships with established producers, and government-backed rebates of 25-30%.'
    },
    {
      question: 'What platforms will the content be distributed on?',
      answer: 'All content is developed with platform-ready formats for major streaming services including Netflix, Amazon Prime, and SkyShowtime, ensuring broad global reach and commercial viability.'
    },
    {
      question: 'What additional benefits do investors receive?',
      answer: 'Investors enjoy unique entertainment industry access including red carpet premiere access, on-set visitation rights, and the opportunity to be part of the creative process behind major film and television productions.'
    },
    {
      question: 'What is Quadrantis Capital\'s track record?',
      answer: 'Founded in 2014, Quadrantis Capital is a CMVM-registered asset manager currently managing €230 million in assets and expanding toward €500 million AUM, with deep expertise in venture capital, private equity, and strategic investments.'
    }
  ]
};