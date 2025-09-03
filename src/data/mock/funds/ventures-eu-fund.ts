import { Fund } from '../../types/funds';

export const venturesEUFund: Fund = {
  id: 'ventures-eu-fund-i',
  name: 'Ventures.eu Fund I',
  description: 'A CMVM-regulated, closed-ended private equity and venture capital fund investing in high-growth technology-driven companies, with a focus on scalability, innovation, and strong exit potential.',
  tags: [
    'Private Equity',
    'Venture Capital',
    'Technology',
    'AI-Driven',
    'Regulated',
    'Golden Visa Eligible',
    'Closed Ended',
    'Lock-Up',
    'Portugal',
    'Healthcare',
    'Energy',
    'High Risk'
  ],
  category: 'Private Equity & Venture Capital',
  minimumInvestment: 100000,
  fundSize: 50,
  managementFee: 2.0,
  performanceFee: 20,
  term: 8,
  managerName: 'Heed Capital SGOIC, S.A.',
  returnTarget: 'Double-digit net IRRs',
  fundStatus: 'Open',
  established: 2004,
  regulatedBy: 'CMVM',
  eligibilityBasis: {
    portugalAllocation: 60,
    maturityYears: 8,
    realEstateExposure: 'None',
    managerAttestation: true
  },
  cmvmId: "Not provided",
  location: 'Portugal',
  detailedDescription: `Ventures.eu Fund I is a CMVM-regulated, closed-ended private equity and venture capital fund that invests in high-growth technology-driven companies across Portugal and the EU. The fund focuses on sectors including fintech, AI, clean tech, health tech, and digital transformation, targeting companies with significant growth potential and clear paths to profitability.

The fund takes minority equity stakes with active management involvement and strategic support, aiming to achieve capital appreciation through portfolio companies' growth and strategic exits. With a primary focus on Portuguese SMEs and up to 40% allocation to other EU markets, the fund provides investors exposure to Europe's most innovative technology companies.

Managed by Heed Capital SGOIC, S.A., an independent asset manager with over €350M under management and extensive experience in Golden Visa-eligible funds, the fund offers institutional-quality private equity investing with strong governance frameworks and diversified risk management.`,
  geographicAllocation: [
    { region: 'Portugal', percentage: 60 },
    { region: 'Other EU', percentage: 40 }
  ],
  team: [
    {
      name: 'Pedro Alves',
      position: 'Chief Investment Officer',
      bio: 'Chief Investment Officer responsible for investment strategy and portfolio management'
    },
    {
      name: 'Joaquim Luiz Gomes',
      position: 'CEO & Chairman',
      bio: 'Chief Executive Officer and Chairman of Heed Capital SGOIC, S.A.'
    },
    {
      name: 'Nuno Pinto',
      position: 'CFO & Board Member',
      bio: 'Chief Financial Officer and Board Member'
    },
    {
      name: 'Gustavo Caiuby Guimarães',
      position: 'Commercial Director & Board Member',
      bio: 'Commercial Director and Board Member'
    }
  ],
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    minimumHoldingPeriod: 96, // 8 years in months
    notes: 'Closed-ended fund - redemptions occur upon asset sales or at fund maturity (8 years with possible 2-year extension)'
  },
  faqs: [
    {
      question: 'What types of companies does the fund invest in?',
      answer: 'The fund invests in high-growth technology-driven companies in sectors like fintech, AI, clean tech, health tech, and digital transformation, focusing on Portuguese and EU-based SMEs with strong scalability and exit potential.'
    },
    {
      question: 'What is the minimum investment amount?',
      answer: '€100,000 per investor. For Golden Visa applicants, the minimum investment is €500,000 in eligible funds.'
    },
    {
      question: 'What is the fund term and investment period?',
      answer: 'The fund has an 8-year term with a possible 2-year extension for exits. The investment period is the first 5 years post-first closing.'
    },
    {
      question: 'What are the expected returns?',
      answer: 'The fund targets double-digit net IRRs over the life of the fund through capital appreciation and strategic exits.'
    },
    {
      question: 'Is this fund Golden Visa eligible?',
      answer: 'Yes, the fund is fully compliant with Portugal\'s €500,000 investment-fund route for Golden Visa applications.'
    },
    {
      question: 'What is the exit strategy?',
      answer: 'Exit strategies include strategic sales to industry players, secondary buyouts, IPOs, or recapitalizations, depending on portfolio company development and market conditions.'
    },
    {
      question: 'How is risk managed?',
      answer: 'Risk is managed through portfolio diversification by sector and stage, active board participation in investee companies, and strong governance frameworks.'
    }
  ]
};