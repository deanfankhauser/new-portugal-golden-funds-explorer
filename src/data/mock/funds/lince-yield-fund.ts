
import { Fund } from '../../types/funds';

export const linceYieldFund: Fund = {
  id: 'lince-yield-fund',
  name: 'Lince Yield Fund, FCR',
  description: 'Open-ended FCR vehicle targeting profitable Portuguese SMEs via senior secured and mezzanine debt, plus hybrid instruments, to deliver stable 5 % p.a. dividends and structured for Portuguese Golden Visa eligibility (minimum €100 000)',
  tags: [
    'Golden Visa Eligible',
    'Debt',
    'Hybrid',
    'SMEs',
    'Liquid',
    'Low-risk',
    'Secondary Market',
    'Diversified',
    'Dividends',
    '5 % Yield'
  ],
  category: 'Private Debt & Hybrid Instruments',
  minimumInvestment: 100000,
  fundSize: 20, // in EUR millions
  managementFee: 2,
  performanceFee: 20,
  subscriptionFee: 0,
  redemptionFee: 0,
  term: 6, // years
  managerName: 'Lince Capital, SCR, S.A.',
  returnTarget: '5% p.a. stable dividends',
  fundStatus: 'Open',
  established: 2025,
  regulatedBy: 'CMVM (license PT.135.267)',
  pficStatus: "Not provided",
  cmvmId: "135267",
  navFrequency: "Quarterly",
  eligibilityBasis: {
    portugalAllocation: 100,
    maturityYears: 6,
    realEstateExposure: "None",
    managerAttestation: true
  },
  location: 'Portugal',
  detailedDescription: 'Lince Yield Fund is designed to generate a dependable 5 % p.a. yield by financing profitable Portuguese SMEs through a mix of senior secured loans, second-lien debt, mezzanine instruments and selected hybrids. The strategy emphasizes capital preservation and downside protection via rigorous covenants, high-quality collateral and sector diversification. Investors receive annual dividends commencing in 2026, with full capital reimbursement by year 5, and may trade participation units on the secondary market at any time.',
  geographicAllocation: [
    {
      region: 'Portugal',
      percentage: 100
    }
  ],
  team: [
    {
      name: 'Vasco Pereira Coutinho',
      position: 'CEO & Founding Partner'
    },
    {
      name: 'Lourenço Mayer',
      position: 'Head of Growth Funds'
    },
    {
      name: 'Afonso Pinheiro',
      position: 'Managing Partner (Omnium Guidance)'
    },
    {
      name: 'António Caleia',
      position: 'Founding Partner (Omnium Guidance)'
    },
    {
      name: 'Francisco Formigal Pinto',
      position: 'Managing Partner (Omnium Guidance)'
    },
    {
      name: 'Tomás Lavin Peixe',
      position: 'Head of Innovation Funds'
    }
  ],
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    minimumHoldingPeriod: 72, // 6 years in months
    notes: 'Investors may sell participation units at any time on the secondary market without penalty'
  },
  faqs: [
    {
      question: 'What is the Lince Yield Fund?',
      answer: 'The Lince Yield Fund, FCR is a CMVM-regulated venture capital vehicle focused on providing senior and hybrid debt financing to profitable Portuguese SMEs, targeting stable income and capital preservation.'
    },
    {
      question: "What is the fund's legal structure?",
      answer: 'It is structured as a Venture Capital Fund under the Portuguese legal framework for Venture Capital, Social Entrepreneurship and Specialized Investment (Annex to Law no. 18/2015 of 4 March).'
    },
    {
      question: 'Who manages and oversees the fund?',
      answer: 'Lince Capital, SCR, S.A. (NIPC 513500707), a CMVM-licensed fund manager headquartered in Lisbon, acts as the managing body.'
    },
    {
      question: 'What is the target fund size?',
      answer: 'The fund is targeting a total capital raise of €20 million.'
    },
    {
      question: 'What is the minimum subscription amount?',
      answer: 'Investors may participate from a minimum subscription of €100,000, in participation units ("PUs") with a face value of €1,000 each.'
    },
    {
      question: "What is the fund's term and investment period?",
      answer: 'The vehicle has a six-year term with a three-year investment period, during which capital will be deployed into portfolio companies.'
    },
    {
      question: 'What fees are charged to investors?',
      answer: 'Set-up fee: 3 % one-off (included in the subscription amount). Management fee: 2 % per annum on realized capital. Performance fee: 20 % carry on profits above a 3 % hurdle, with a catch-up mechanism.'
    },
    {
      question: 'How does the performance fee (carry) work?',
      answer: 'Once investors receive a 3 % preferred return, 20 % of any additional profits are allocated to the fund manager, with the remaining 80 % distributed to investors.'
    },
    {
      question: "What is the fund's target return and cash-flow profile?",
      answer: 'The fund aims to deliver stable annual dividends of 5 % from 2026 onwards, with full return of subscribed capital by year 5 upon repayment of underlying loans.'
    },
    {
      question: 'Which types of instruments does the fund invest in?',
      answer: 'It deploys capital through senior secured loans, second-lien loans and mezzanine debt—favoring bullet loans with recurring interest payments to generate yield.'
    },
    {
      question: 'What sectors does the fund target?',
      answer: 'The investment policy is sector-agnostic but focuses on non-cyclical industries with long-term growth tailwinds, explicitly excluding real estate.'
    },
    {
      question: 'What profile of companies does the fund finance?',
      answer: 'Target companies are Portuguese SMEs with viable business models, predictable cash flows, strong governance, experienced management teams, and collateralizable assets.'
    },
    {
      question: 'What is the typical ticket size per investment?',
      answer: 'Each financing transaction ranges from €1 million to €5 million, depending on the company\'s capital needs and collateral capacity.'
    },
    {
      question: 'How does the fund mitigate downside risk?',
      answer: 'Risk is managed via rigorous due diligence, financial and operational covenants, high-quality collateral, portfolio diversification across companies and sectors, and continuous monitoring.'
    },
    {
      question: 'What tax considerations apply?',
      answer: 'National residents incur a 10 % withholding tax on capital gains generated by the fund, while non-resident investors benefit from no withholding tax on distributions and gains.'
    }
  ]
};
