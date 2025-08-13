import { Fund } from '../../types/funds';

export const emeraldGreenFund: Fund = {
  id: 'emerald-green-fund',
  name: 'Emerald Green Fund',
  managerName: 'STAG Fund Management SCR, S.A.',
  managerLogo: undefined, // No logo provided
  category: 'Private Equity',
  tags: ['Private Equity', 'Tourism', 'Sustainability', 'Golden Visa Eligible', 'Portugal', 'Closed Ended'],
  description: 'A Golden Visa–eligible private equity fund targeting sustainable tourism and hospitality development in Portugal\'s Douro Valley, focusing on a 5-star luxury eco-resort.',
  detailedDescription: `The Emerald Green Fund is a specialized hospitality investment vehicle targeting the development of a luxury eco-resort in Portugal's prestigious Douro Valley, a UNESCO World Heritage site renowned for its wine tourism and natural beauty.

Project Scope:
• Development of a 5-star luxury eco-resort in the Douro Valley
• Premium amenities including wellness spa, wine cellar, gourmet restaurant, vineyard tours, and event hosting facilities
• Designed for minimal environmental impact with sustainability certifications
• Located in one of Portugal's most sought-after tourism destinations

Investment Strategy:
• Acquisition and development of prime hospitality asset in world-renowned wine region
• Target high occupancy rates driven by luxury tourism growth in Portugal
• Exit strategy via strategic sale to international hotel chain or institutional investor after stabilization
• Focus on premium room rates, wine tourism experiences, and luxury event hosting

Risk Mitigation:
• Located in high-demand tourism region with limited new luxury developments
• Backed by STAG Fund Management's proven hospitality and investment track record
• Fully licensed project with planning and environmental permits secured before construction
• Long-term revenue potential through diversified income streams including accommodation, dining, events, and wine tourism

ESG & Sustainability Focus:
• Eco-conscious operations with strong sustainability credentials
• Minimal environmental impact design and construction
• Compliance with international sustainability certifications
• Integration with local wine culture and heritage preservation

The fund is managed by STAG Fund Management SCR, S.A., leveraging their expertise across 19 funds and €400+ million in combined assets, with specific experience in hospitality and tourism investments.`,
  minimumInvestment: 500000,
  fundSize: 50, // €50M target (in millions)
  managementFee: 2.0, // Standard STAG rate
  performanceFee: 20, // Standard rate
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 8, // 7-8 years including divestment
  returnTarget: "11% IRR (projected)",
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
    notes: '7-8 year investment term including divestment phase. Exit via strategic sale after stabilization.'
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
      bio: 'Partner since 2023 MBO overseeing investor relations and business development. Managed over €2 billion in assets globally with hospitality expertise'
    },
    {
      name: 'Gisela Martins',
      position: 'Board Member',
      bio: 'Board member since 2021 heading legal and compliance. 20+ years experience in M&A, joint ventures, and private equity with hospitality focus'
    },
    {
      name: 'Nathan Hellmann',
      position: 'Director of Business Development',
      bio: '10+ years in investment management and corporate structuring, leading global client engagement in hospitality and tourism sectors'
    }
  ],
  documents: [
    {
      title: 'Fund Prospectus',
      url: '#'
    },
    {
      title: 'Hospitality Development Plan',
      url: '#'
    },
    {
      title: 'Sustainability & ESG Framework',
      url: '#'
    },
    {
      title: 'Douro Valley Tourism Analysis',
      url: '#'
    },
    {
      title: 'Golden Visa Compliance Documentation',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'Why invest in the Douro Valley specifically?',
      answer: 'The Douro Valley is a UNESCO World Heritage site and one of Portugal\'s premier wine tourism destinations. It offers limited new luxury developments, creating strong demand for high-end accommodations with excellent long-term appreciation potential.'
    },
    {
      question: 'What makes this resort sustainable and eco-friendly?',
      answer: 'The resort is designed for minimal environmental impact with sustainability certifications, eco-conscious operations, and integration with local wine culture and heritage preservation, providing strong ESG credentials.'
    },
    {
      question: 'What amenities will the resort offer?',
      answer: 'The 5-star luxury resort will feature a wellness spa, wine cellar, gourmet restaurant, vineyard tours, event hosting facilities, and premium accommodations designed to attract high-end international tourists.'
    },
    {
      question: 'What is the exit strategy for this investment?',
      answer: 'The planned exit is via strategic sale to an international hotel chain or institutional investor after the resort reaches operational stabilization, typically within 7-8 years of investment.'
    },
    {
      question: 'Do investors receive any resort benefits?',
      answer: 'Yes, investors receive complimentary annual stays and resort perks (subject to terms), allowing them to experience their investment firsthand while enjoying the luxury amenities.'
    },
    {
      question: 'How does STAG\'s experience benefit this hospitality investment?',
      answer: 'STAG Fund Management has extensive experience managing hospitality investments within their 19-fund portfolio and €400+ million in assets, providing proven expertise in tourism and hospitality development and operations.'
    }
  ]
};