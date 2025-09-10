import { Fund } from '../../types/funds';

export const portugalPrimeFCR: Fund = {
  id: 'portugal-prime-fcr',
  name: 'Portugal Prime, FCR',
  managerName: 'Biz Capital SGOIC',
  managerLogo: undefined,
  category: 'Private Equity',
  tags: ['Private Equity', 'Golden Visa Eligible', 'Low-risk', 'Portugal', 'Closed Ended', 'Tourism'],
  description: 'Closed-end CMVM-regulated private equity fund investing in hospitality operators (non-real-estate) across Portugal\'s tourism sector; offers two tracks — 2% p.a. fixed (Capital Preservation, exit at citizenship) or ~10% target IRR (Upside, exit at maturity); Golden Visa eligible (minimum €100,000).',
  detailedDescription: `Portugal Prime finances and operates hotel businesses (rooms, F&B, events) via operator equity/leases — no direct or indirect real-estate investment — aiming to preserve capital while delivering either a fixed 2% p.a. (citizenship exit) or ~10% IRR (maturity exit). The fund targets low risk (SRI 3/7) within Portugal's resilient tourism sector.

Key Investment Highlights:
• Award-winning management: Fund Manager of the Year 2024 winner
• Ultra-low risk profile: Risk level 3/7 vs other GV funds at 6/7
• Proven track record: 100% success rate for Golden Visa applications
• Global accessibility: Direct investments from overseas accepted (no Portuguese bank account required)
• Golden Visa pathway with minimum €100,000 investment requirement
• Hospitality sector focus on operators, not real estate
• Two investment tracks: Capital Preservation (2% p.a. fixed) or Upside (~10% target IRR)
• Ultra-low fee structure: 0.20% management fee
• CMVM regulated with Bison Bank as depositary and BDO as auditor

Investment Options:
1. Upside Participation: Targets net annual returns above 10%, requiring investment until maturity (8 years)
2. Capital Preservation: Capped at 5% annual return net of fees, with exit possible after obtaining permanent residency (5–6 years)

Exclusive Investor Benefits:
• Investors committing the full €500,000 receive one complimentary week per year in deluxe hotels or serviced apartments
• Alternative: Two weeks every two years, typically aligned with biometric visits
• VIP project visits in the Algarve with personalized tours and limo service

The fund offers a specialized approach to Portugal's tourism sector, focusing on operational excellence rather than property investment, providing a clear Golden Visa pathway with flexible exit options and exceptional investor perks.`,
  minimumInvestment: 100000,
  fundSize: 100,
  managementFee: 0.20,
  performanceFee: 25,
  subscriptionFee: 0,
  redemptionFee: 0,
  term: 8,
  returnTarget: "2% p.a. fixed (Capital Preservation) or ~10% target IRR (Upside)",
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
    minimumHoldingPeriod: 60,
    notes: 'Two investor tracks — Capital Preservation (2% p.a., exit on citizenship, 5-6 years) or Upside (~10% IRR, exit at maturity, 8 years)'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 100 }
  ],
  team: [
    {
      name: 'Armando Nunes',
      position: 'Fund Management',
      bio: 'Experienced fund manager specializing in hospitality sector investments'
    },
    {
      name: 'Filipe Leal',
      position: 'Civil Engineering',
      bio: 'Civil engineering expertise for hospitality project development'
    },
    {
      name: 'Peter Pedersen',
      position: 'Hotel Operations',
      bio: 'Specialist in hotel operations and hospitality management'
    },
    {
      name: 'Mathilde Jakobsen',
      position: 'Marketing & Sales',
      bio: 'Marketing and sales specialist for hospitality sector'
    },
    {
      name: 'Nadia Lassen',
      position: 'Interior Design',
      bio: 'Interior design expert for hospitality properties'
    },
    {
      name: 'Patrícia Inácio',
      position: 'Legal Support',
      bio: 'Legal support specialist for fund operations and compliance'
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
      title: 'Golden Visa Compliance Documentation',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What are the two investment tracks available?',
      answer: 'Upside Participation targets net annual returns above 10% requiring investment until maturity (8 years), while Capital Preservation is capped at 5% annual return net of fees with exit possible after obtaining permanent residency (5–6 years).'
    },
    {
      question: 'What makes this fund less risky than other Golden Visa options?',
      answer: 'Portugal Prime has a risk level of only 3 out of 7, significantly lower than other GV funds which typically have a risk level of 6. The fund also has a 100% success rate for Golden Visa applications.'
    },
    {
      question: 'Do I need a Portuguese bank account to invest?',
      answer: 'No, direct investments from overseas are accepted without requiring a Portuguese bank account, making the investment process more accessible for international investors.'
    },
    {
      question: 'What exclusive benefits do larger investors receive?',
      answer: 'Investors committing the full €500,000 receive one complimentary week per year in deluxe hotels or serviced apartments, or two weeks every two years, typically aligned with biometric visits.'
    },
    {
      question: 'What recognition has the fund management received?',
      answer: 'The fund management team was awarded Fund Manager of the Year 2024, demonstrating their expertise and excellence in the hospitality investment sector.'
    }
  ],
  eligibilityBasis: {
    portugalAllocation: 100,
    realEstateExposure: 'None',
    managerAttestation: true
  }
};