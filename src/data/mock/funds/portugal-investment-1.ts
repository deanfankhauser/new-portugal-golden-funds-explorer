
import { Fund } from '../../types/funds';

export const portugalInvestment1: Fund = {
  id: "portugal-investment-1",
  name: "Portugal Investment 1",
  description: "Open-ended private equity & venture capital fund focused on value creation in unlisted Portuguese SMEs and mid-caps via special-situations investments, structured to satisfy Portuguese Golden Visa requirements.",
  category: "Private Equity & Venture Capital",
  tags: [
    'Golden Visa Eligible',
    'Private Equity',
    'Venture Capital',
    'Special Situations',
    'SMEs',
    'Mid-Cap',
    'Lock-Up',
    'No Fees',
    'Tax Free',
    'Capital Growth'
  ],
  minimumInvestment: 500000,
  fundSize: 55,
  managementFee: 1,
  performanceFee: 20,
  subscriptionFee: 0,
  redemptionFee: 0,
  term: 6,
  managerName: "Saratoga Capital Partners",
  returnTarget: "8-11% annualized",
  fundStatus: "Open",
  websiteUrl: "https://example.com/portugal-investment-1",
  established: 2021,
  regulatedBy: "N/A",
  eligibilityBasis: {
    portugalAllocation: 100,
    maturityYears: 6,
    realEstateExposure: 'None',
    managerAttestation: true
  },
  cmvmId: "SCR-112",
  navFrequency: "Quarterly",
  location: "Portugal",
  detailedDescription: "Portugal Investment 1 is an open-ended private equity and venture capital vehicle sponsored by Saratoga Capital Partners, targeting unlisted Portuguese SMEs and mid-caps undergoing financial restructuring, ownership succession, or operational transitions. The fund leverages Saratoga's in-house operational expertise and hands-on approach to unlock value through equity and fully secured private debt, with capital market placements via blue-chip providers to maintain secondary-market liquidity. Sector-agnostic and return-driven, it invests across industrial, production, and information-technology verticals, aiming for an annualized return of 8–11% over the investment cycle. Investors must commit at least €500,000 and maintain their holding for six years to qualify for the Portuguese Golden Visa, after which they may transfer ownership to third parties or exit tax-free.",
  geographicAllocation: [
    { region: "Portugal", percentage: 100 }
  ],
  documents: [
    { title: "Fund Prospectus", url: "https://example.com/portugal-investment-1-prospectus.pdf" },
    { title: "Investment Strategy", url: "https://example.com/portugal-investment-1-strategy.pdf" },
    { title: "Golden Visa Eligibility", url: "https://example.com/portugal-investment-1-golden-visa.pdf" }
  ],
  redemptionTerms: {
    frequency: "End of Term",
    redemptionOpen: false,
    noticePeriod: 0,
    minimumHoldingPeriod: 72, // 6 years in months
    notes: "Investors may transfer ownership to third parties; capital market placement ensures potential secondary-market liquidity; investment and exit are tax-free under Golden Visa rules."
  },
  faqs: [
    {
      question: 'What is Saratoga Portugal Investment I?',
      answer: 'An open-ended, CMVM-regulated private equity/venture capital fund focused on unlisted Portuguese SMEs and mid-caps with strong profitability potential for long-term growth and consistent annualized returns.'
    },
    {
      question: 'What is the fund\'s investment strategy?',
      answer: 'It targets "special situations" in light industrial, production and IT companies—such as restructurings or ownership transitions—combining equity exposure with fully secured private debt to unlock value.'
    },
    {
      question: 'Who manages the fund?',
      answer: 'Saratoga Capital Partners, founded in 2008 as an M&A guidance and capital-raising boutique, acts as both GP and operator, leveraging multidisciplinary deal-execution experience.'
    },
    {
      question: 'What is the fund\'s target size?',
      answer: 'The fund seeks to raise €55 million in committed capital.'
    },
    {
      question: 'How many portfolio companies will the fund hold?',
      answer: 'It plans to invest in 9–11 companies across its lifetime.'
    },
    {
      question: 'What is the geographic focus?',
      answer: 'Primarily Portugal-based targets, with a broader European-Union diversification strategy.'
    },
    {
      question: 'What types of companies are eligible?',
      answer: 'Unlisted SMEs and mid-caps undergoing financial restructuring or succession, with defensible business models and clear exit appeal to strategic or institutional buyers.'
    },
    {
      question: 'How are investment opportunities sourced?',
      answer: 'Proprietary deal flow from internal origination, lending-bank relationships and NPL management entities.'
    },
    {
      question: 'What is the minimum investment amount?',
      answer: '€500 000 per investor.'
    },
    {
      question: 'What is the fund\'s lock-up period?',
      answer: '72 months, with capital and returns expected to be returned in Year 6.'
    },
    {
      question: 'What fees apply?',
      answer: '– Subscription/redemption fees: 0 %\n– Manager administrative fee: 1 % per annum\n– Carried interest: 20 % on returns above a 5 % hurdle'
    },
    {
      question: 'What historical returns has the fund achieved?',
      answer: 'Since its 2021 inception, the fund has delivered an average IRR of 10 % per annum (≈30 % cumulative).'
    },
    {
      question: 'How does the fund create and protect value?',
      answer: 'Through hands-on operational support in restructurings, rigorous due diligence, secured-debt structuring, and portfolio diversification to mitigate downside risk.'
    },
    {
      question: 'How is liquidity provided?',
      answer: 'Maintains secondary-market liquidity via capital-market placements with blue-chip providers, allowing partial exits before final divestment.'
    },
    {
      question: 'Are there any tax or legal benefits for investors?',
      answer: 'Investments and exits are tax-free, with no subscription or redemption fees, plus simplified legal fees and assistance obtaining a Portuguese tax number and banking relationships.'
    }
  ]
};
