import { Fund } from '../../types/funds';

export const portugalPrimeFund: Fund = {
  id: 'portugal-prime-fund',
  name: 'Portugal Prime Fund',
  managerName: 'BiG Capital SGOIC',
  managerLogo: undefined, // No logo provided
  category: 'Private Equity',
  tags: ['Private Equity', 'Tourism', 'Golden Visa Eligible', 'Low-risk', 'Portugal', 'Closed Ended'],
  description: 'A closed-end private equity fund regulated by CMVM, investing in Portugal\'s thriving hospitality sector. Designed to comply fully with the Portugal Golden Visa requirements.',
  detailedDescription: `Portugal Prime Fund is a specialized hospitality investment fund targeting Portugal's strongest tourism hubs. Winner of Fund Manager of the Year 2024 with a 100% Golden Visa success rate. The fund leverages Portugal's position as a leading European destination with tourism representing 19% of GDP and 31M+ visitors in 2023.

Key Investment Highlights:
• Golden Visa pathway with minimum €500,000 investment requirement
• Risk level of only 3 out of 7 - other GV funds have risk level of 6
• Winner of Fund Manager of the Year 2024
• 100% success rate for Golden Visa applications
• Direct investments from overseas accepted (no Portuguese bank account required)
• Hospitality sector focus - tripled revenue since 2010 while Portuguese stock market declined 27%
• Development & operation model investing in hotel operators (rooms, F&B, events) rather than direct property
• Ultra-low fee structure: 0.20% management fee vs industry average of 2%
• Two investment strategies: Capital Preservation (5% capped IRR) or Upside Participation (10% target IRR)
• Exclusive investor perks including 7-day annual hotel stays at portfolio properties

Two Investment Options:
1. Upside participation – targets net annual returns above 10%, requiring investment until maturity (8 years)
2. Capital preservation – capped at 5% annual return net of fees, with exit possible after obtaining permanent residency (5–6 years)

Exclusive Benefits:
• Investors committing the full €500k receive one complimentary week per year in deluxe hotels or serviced apartments
• VIP project visits in the Algarve with limo service and guided tours

Current Portfolio:
• Vila Maria (Albufeira) - Operating modern hotel with rooftop pool & ocean views
• Marina Apart-hotel - 310 units under construction, prime waterfront location
• Beachfront Hotel - 182 rooms/suites with spa, gym, and events spaces under development

The fund offers a streamlined 4-week process from start to Golden Visa application, managed via the Portugal Prime Investor Platform with real-time access to reports and documentation.`,
  minimumInvestment: 100000,
  fundSize: 100, // €100M target (in millions)
  managementFee: 0.20,
  performanceFee: 25,
  subscriptionFee: 0, // 0% subscription fee
  redemptionFee: 0,
  term: 8, // 8 years
  returnTarget: "5% capped (Capital Preservation) or 10% target (Upside Participation)",
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
    minimumHoldingPeriod: 60, // 5 years for Capital Preservation option
    notes: 'Two exit options: Capital Preservation (5-6 years for citizenship) or Upside Participation (8 years at fund maturity)'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 100 }
  ],
  team: [
    {
      name: 'BiG Capital SGOIC Team',
      position: 'Fund Management',
      bio: '20+ years of institutional fund management experience specializing in hospitality and real estate investments'
    }
  ],
  documents: [
    {
      title: 'Fund Prospectus',
      url: '#'
    },
    {
      title: 'Golden Visa Compliance Documentation',
      url: '#'
    },
    {
      title: 'Hospitality Portfolio Overview',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What are the two investment options available?',
      answer: 'Capital Preservation offers 5% capped IRR with exit upon citizenship (5-6 years), while Upside Participation targets 10% IRR with exit at fund maturity (8 years).'
    },
    {
      question: 'How does the reduced capital option work?',
      answer: 'Investors can participate from €300K using an exclusive loan facility where €200K is loaned to the investor\'s non-Portuguese account. The loan provider takes yields while the investor retains Golden Visa eligibility.'
    },
    {
      question: 'What makes the fee structure attractive?',
      answer: 'The fund charges only 0.20% management fee (1/10th of industry average), 0% subscription fee, and 25% performance fee only on profits above 5% hurdle.'
    },
    {
      question: 'What exclusive perks do investors receive?',
      answer: 'Investors committing the full €500k receive one complimentary week per year in deluxe hotels or serviced apartments, plus VIP project visits in the Algarve with limo service and guided tours.'
    },
    {
      question: 'How quickly can I apply for Golden Visa after investing?',
      answer: 'The streamlined process takes approximately 4 weeks from start to Golden Visa application, managed via the Portugal Prime Investor Platform.'
    },
    {
      question: 'Why invest in Portugal\'s hospitality sector?',
      answer: 'Tourism represents 19% of Portugal\'s GDP with 31M+ visitors in 2023 (up 21% YoY). The hospitality sector has tripled revenue since 2010 while the Portuguese stock market declined 27%.'
    }
  ],
  eligibilityBasis: {
    portugalAllocation: 100,
    maturityYears: 8,
    realEstateExposure: 'None',
    managerAttestation: true
  },
  cmvmId: 'CMVM-123456',
  navFrequency: 'Monthly'
};