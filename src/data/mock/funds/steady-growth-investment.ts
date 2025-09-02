
import { Fund } from '../../types/funds';

export const steadyGrowthInvestment: Fund = {
  id: 'steady-growth-investment',
  name: 'Steady Growth Investment Fund',
  description: 'Your path to secure wealth building through a diversified, actively managed multi-asset strategy combining bonds, equities, gold and deposits, tailored for Golden Visa investors in Portugal.',
  tags: [
    'Golden Visa Eligible',
    'Bonds',
    'Equities',
    'Gold',
    'Deposits',
    'Liquid',
    'Balanced',
    'Low Risk',
    'AI-Driven',
    'Diversified'
  ],
  category: 'Multi-Asset',
  minimumInvestment: 500000, // Standard GV minimum
  fundSize: 0, // N/A
  managementFee: 0, // N/A
  performanceFee: 0, // N/A
  subscriptionFee: 0, // N/A
  redemptionFee: 0, // N/A
  term: 0, // N/A
  managerName: 'Celtis Venture Partners',
  managerLogo: undefined,
  returnTarget: 'N/A',
  fundStatus: 'Open', // Default to Open since status was marked as N/A
  websiteUrl: undefined,
  established: 0, // N/A
  regulatedBy: 'N/A',
  location: 'Portugal',
  detailedDescription: 'Steady Growth Investment Fund is an open-ended, actively managed vehicle designed to deliver stable, long-term returns by blending 70 % bonds, 15 % equities, 10 % gold and 5 % deposits. The bond sleeve spans corporate and government issuers across Portugal, Europe and North America, while equity exposure is achieved via diversified stock indices and ETFs. The portfolio is rebalanced quarterly to navigate market cycles and protect capital. Despite major geopolitical and economic shocks over the past seven years, the strategy has achieved a cumulative 4.14 % gain and currently delivers an annualized return of 7.86 %.',
  geographicAllocation: [
    {
      region: 'Portugal',
      percentage: 60
    },
    {
      region: 'Europe',
      percentage: 15
    },
    {
      region: 'Global',
      percentage: 15
    },
    {
      region: 'USA',
      percentage: 5
    },
    {
      region: 'Other',
      percentage: 5
    }
  ],
  team: [
    {
      name: 'Mark Gomes',
      position: 'Executive Board Member & COO'
    },
    {
      name: 'João Sousa Dias',
      position: 'CRO'
    },
    {
      name: 'João Baptista',
      position: 'Partner, CEO & Co-founder of Spark Capital'
    },
    {
      name: 'Miguel Alpendre',
      position: 'CEO'
    },
    {
      name: 'Carlos Pontes Lopes',
      position: 'CFO'
    },
    {
      name: 'Inês Cunha e Silva',
      position: 'Partner, COO & Co-founder of Spark Capital'
    }
  ],
  documents: [],
  redemptionTerms: {
    frequency: 'Not Available',
    redemptionOpen: false,
    notes: 'Investor units can be repurchased by partners upon request; dividends are distributed annually during divestment.'
  },
  faqs: [
    {
      question: 'What is the Steady Growth Investment Fund?',
      answer: 'A CMVM-regulated balanced-risk fund designed to build wealth steadily by blending traditional financial assets with select alternative investments under a single, actively managed vehicle.'
    },
    {
      question: 'Who manages the fund?',
      answer: 'It\'s overseen by Celtis Venture Partners—a team of seasoned investment professionals, including João Sousa Dias, João Baptista, Miguel Alpendre, Carlos Pontes Lopes, Mark Gomes and Inês Cunha e Silva—bringing over 30 years of combined experience.'
    },
    {
      question: 'What is the target fund size and expected return?',
      answer: 'The fund aims to raise €50 million in equity and targets a 15–20% annual IRR for investors, balancing growth with capital preservation.'
    },
    {
      question: 'How is the portfolio allocated across asset classes?',
      answer: '70% Bonds, 15% Gold, 10% Equities, 5% Bank Deposits.'
    },
    {
      question: 'How is the portfolio allocated geographically?',
      answer: '60% Portugal, 15% Europe, 15% Global markets, 5% USA, 5% Other regions.'
    },
    {
      question: 'What alternative investments does the fund include?',
      answer: 'Up to 20% in tangible assets such as classic vehicles (value appreciation), compact workspaces (asset-backed income) and a luxury-goods e-commerce platform, to diversify beyond financial markets.'
    },
    {
      question: 'How often is the portfolio reviewed and rebalanced?',
      answer: 'The fund is actively managed and updated quarterly, ensuring allocations stay aligned with market conditions and target risk/return parameters.'
    },
    {
      question: 'How has the fund performed through recent market shocks?',
      answer: 'Its strategy delivered a 4.14% cumulative gain over the past seven years—even amid COVID-19, the Ukraine war, rising inflation and interest-rate spikes—demonstrating resilience to volatility.'
    },
    {
      question: 'What is the annualized return since inception?',
      answer: 'Investors have realized a 7.86% annualized return since the fund\'s launch.'
    },
    {
      question: 'How does the profit-sharing mechanism work?',
      answer: 'The first 6% of profits accrue entirely to investors (LPs). The next 2% goes to the fund manager (GP). Profits beyond 8% are split 75% to LPs / 25% to GPs.'
    },
    {
      question: 'What is the fund\'s term and investment timeline?',
      answer: 'It follows a 10-year lifecycle (Year 0–10), from initial capital deployment through to final divestment and profit distribution.'
    },
    {
      question: 'Can investors exit the fund before maturity?',
      answer: 'Yes—if an investor opts to withdraw during the investment period, their participation units can be repurchased by the partners at prevailing valuations.'
    },
    {
      question: 'How and when are dividends distributed?',
      answer: 'The fund aims to distribute annual dividends, contingent on its yearly financial performance, with full payment of any accrued dividends in the divestment period.'
    },
    {
      question: 'What measures are in place to mitigate risk?',
      answer: 'Diversification across asset classes and geographies, a mix of yield-generating and real-asset holdings, plus alternative investments, all under active quarterly management, work together to smooth returns and protect capital.'
    },
    {
      question: 'What is the fund\'s investment philosophy?',
      answer: 'It embraces a moderate-risk profile—balancing fixed income, commodities, equities and select tangible assets—to achieve stable long-term growth while minimizing downside exposure.'
    }
  ]
};
