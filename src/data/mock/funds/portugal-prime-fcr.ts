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
• Golden Visa pathway with minimum €100,000 investment requirement
• Hospitality sector focus on operators, not real estate
• Two investment tracks: Capital Preservation (2% p.a. fixed) or Upside (~10% target IRR)
• Ultra-low fee structure: 0.20% management fee
• Risk indicator 3/7 vs typical funds at 6/7
• CMVM regulated with Bison Bank as depositary and BDO as auditor

The fund offers a specialized approach to Portugal's tourism sector, focusing on operational excellence rather than property investment, providing a clear Golden Visa pathway with flexible exit options.`,
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
      answer: 'Capital Preservation offers 2% p.a. fixed return with exit upon citizenship (5-6 years), while Upside targets ~10% IRR with exit at fund maturity (8 years).'
    },
    {
      question: 'How is this different from real estate funds?',
      answer: 'Portugal Prime invests in hospitality operators (rooms, F&B, events) via equity/leases, not direct or indirect real estate investment, making it Golden Visa eligible.'
    },
    {
      question: 'What makes the fee structure attractive?',
      answer: 'The fund charges only 0.20% management fee, 0% subscription fee, and 25% performance fee only on returns above 5% hurdle rate.'
    },
    {
      question: 'What is the risk profile of this fund?',
      answer: 'The fund targets low risk with SRI 3/7 rating, significantly lower than typical funds at 6/7, focusing on Portugal\'s resilient tourism sector.'
    },
    {
      question: 'Who are the key service providers?',
      answer: 'The fund is managed by Biz Capital SGOIC, with Bison Bank as depositary and BDO & Associados as auditor, ensuring institutional-grade oversight.'
    }
  ],
  eligibilityBasis: {
    portugalAllocation: 100,
    realEstateExposure: 'None',
    managerAttestation: true
  }
};