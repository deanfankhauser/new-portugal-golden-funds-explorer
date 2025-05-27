
import { Fund } from '../../types/funds';

export const linceGrowthFund: Fund = {
  id: 'lince-growth-fund',
  name: 'Lince Growth Fund I, FCR',
  description: 'Closed-ended venture capital and private equity fund targeting growth and consolidation of Portuguese industrial and circular-economy SMEs via equity, hybrid and debt instruments, structured to satisfy Golden Visa requirements.',
  tags: [
    'Golden Visa Eligible',
    'Private Equity',
    'Venture Capital',
    'Industrial',
    'Circular Economy',
    'Equity',
    'Debt',
    'Special Situations',
    'Secondary Market',
    'Long Term'
  ],
  category: 'Private Equity & Venture Capital',
  minimumInvestment: 100000,
  fundSize: 20, // in EUR millions
  managementFee: 2,
  performanceFee: 20,
  subscriptionFee: 3,
  term: 7, // years
  managerName: 'Lince Capital, SCR, S.A.',
  returnTarget: '15-20% p.a.',
  fundStatus: 'Open',
  established: 2025,
  regulatedBy: 'CMVM (Portuguese Securities Market Commission)',
  location: 'Portugal',
  detailedDescription: 'Lince Growth Fund I is a closed-ended FCR vehicle designed for non-EU investors seeking Portuguese residency through the Golden Visa program. The fund targets small-to-mid-cap industrial and circular-economy businesses, deploying €1.5 m–€5 m tickets via equity, hybrids and secured debt to balance upside potential with downside protection. Leveraging Lince Capital\'s 30+ years of experience and Omnium Advisory\'s deal-sourcing network, the strategy emphasizes operational improvements, export growth and ESG integration. Investors benefit from a 3 % one-off setup fee, 2 % p.a. management fee, and 20 % carry above a 5 % IRR hurdle. Units carry a 7-year maturity, with distributions from year 3 and a secondary-market exit option thereafter. The fund aims for a 15–20 % annualized return, fully aligning with residency requirements.',
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
      position: 'Managing Partner (Omnium Advisory)'
    },
    {
      name: 'António Caleia',
      position: 'Founding Partner, Omnium Advisory'
    },
    {
      name: 'Francisco Formigal Pinto',
      position: 'Managing Partner, Omnium Advisory'
    },
    {
      name: 'Tomás Lavin Peixe',
      position: 'Head of Innovation Funds'
    }
  ],
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    minimumHoldingPeriod: 84, // 7 years in months
    notes: 'Investors may sell participation units to Lince Capital, private investors or specialized funds; expected capital distributions from year 3 with full return by maturity.'
  },
  faqs: [
    {
      question: 'What is the Lince Growth Fund I?',
      answer: 'Lince Growth Fund I, FCR is a CMVM-regulated Venture Capital Fund targeting growth and consolidation of small to mid-sized industrial and circular-economy businesses in Portugal, with a diversified portfolio approach to optimize risk-return.'
    },
    {
      question: "What is the fund's legal structure?",
      answer: "It's structured as a Venture Capital Fund under the Portuguese legal framework for Venture Capital, Social Entrepreneurship and Specialized Investment (Annex to Law no. 18/2015 of 4 March)."
    },
    {
      question: 'Who is the managing body?',
      answer: 'The fund is managed by Lince Capital, SCR, S.A. (NIPC 513500707), a CMVM-licensed fund manager headquartered in Lisbon.'
    },
    {
      question: 'What is the target size of the fund?',
      answer: 'The fund aims to raise a total of €20 million in committed capital.'
    },
    {
      question: 'What is the minimum subscription amount?',
      answer: 'Investors may subscribe from a minimum of €100,000, in participation units (PUs) with a face value of €1,000 each.'
    },
    {
      question: "What is the fund's term and maturity?",
      answer: 'The vehicle has a 7-year term, running until 2031.'
    },
    {
      question: 'What is the investment period?',
      answer: 'Capital will be deployed over a four-year investment period within the 7-year term.'
    },
    {
      question: 'What fees and commissions apply?',
      answer: 'Set-up fee: 3 % one-off (deducted from subscribed capital). Management fee: 2 % per annum on subscribed capital. Performance fee (carry): 20 % of profits above a 5 % preferred-return hurdle, with catch-up mechanics to align interests.'
    },
    {
      question: 'What tax regime applies to gains and distributions?',
      answer: 'National (Portugal-tax) residents incur a 10 % withholding tax on capital gains, while non-resident investors pay no withholding tax on distributions or gains.'
    },
    {
      question: 'What target return does the fund aim to deliver?',
      answer: 'The fund seeks to generate 15–20 % per annum net returns for investors.'
    },
    {
      question: "What is the fund's core investment strategy?",
      answer: 'It focuses on identifying small industrial or circular-economy SMEs with succession or growth-capital needs, then supporting their expansion to drive value creation, while maintaining portfolio diversification across sub-sectors and geographies.'
    },
    {
      question: 'Through what instruments and ticket sizes does the fund invest?',
      answer: 'The fund deploys capital via equity, hybrid, and debt instruments; typical equity ticket sizes range from €1.5 million to €5 million per company.'
    },
    {
      question: 'Which sectors are preferentially targeted?',
      answer: 'Preference is given to industrial and circular-economy companies, though the fund may opportunistically invest in other sectors exhibiting strong growth potential.'
    },
    {
      question: 'What are the key investment criteria for portfolio companies?',
      answer: 'Target businesses typically exhibit: Revenues of €5 million–€10 million and EBITDA of €500 k–€1.5 million. Acquisition price below market and historical growth above market. Stable, contract-backed revenues with price-pass-through capability. Strong export capabilities, solid customer base, and low churn. High cash-conversion ratios, low leverage, and collateralizable assets. Talented middle-management teams to drive operational improvements.'
    },
    {
      question: 'How and when will investors receive returns, and what exit options exist?',
      answer: 'Distributions begin in Year 3 using operating cash flows and divestment proceeds. The fund targets returning 100 % of subscribed capital by Year 5, with excess-profit distributions thereafter. Investors may hold until maturity or sell their PUs on the secondary market—to Lince Capital, private secondary-market funds, or other qualified buyers—at any time.'
    }
  ]
};
