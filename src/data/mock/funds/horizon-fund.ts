
import { Fund } from '../../types/funds';

export const horizonFund: Fund = {
  id: "horizon-fund",
  name: "Horizon Fund",
  description: "Open Ended Fund investing 65% in Portuguese Fixed Income and 35% in Digital Assets with access to Golden Visa in Portugal",
  category: "Mixed",
  tags: ['Bonds', 'Crypto', 'Liquid', 'Low-risk', 'Regulated', 'Open Ended', 'Bitcoin', 'Ethereum', 'Solana'],
  minimumInvestment: 100000,
  fundSize: 100,
  managementFee: 2,
  performanceFee: 20,
  subscriptionFee: 0,
  redemptionFee: 2,
  term: 6,
  managerName: "Octanova SCR, S.A.",
  returnTarget: "15-20% projected IRR",
  fundStatus: "Open",
  websiteUrl: "https://example.com/horizon-fund",
  established: 2023,
  regulatedBy: "Octanova SCR, S.A. (registered with CMVM)",
  pficStatus: "Not provided",
  cmvmId: "2122",
  navFrequency: "Daily",
  eligibilityBasis: {
    portugalAllocation: 60,
    maturityYears: 6,
    realEstateExposure: 'None',
    managerAttestation: true
  },
  location: "Portugal",
  detailedDescription: "Horizon Fund is the first Golden-Visa-eligible SCR vehicle in Portugal, offering a blended strategy with a minimum allocation of 60% of its net asset value (NAV) in securities of issuers based in Portugal, and up to 40% in large-cap digital assets (e.g. Bitcoin, Ethereum). As an open-ended fund with monthly subscriptions and redemptions, it provides both liquidity and stability: Portuguese bond holdings generate steady income while crypto allocations capture growth potential. A robust risk-management framework—including stop-loss triggers, liquidity buffers and independent oversight—helps control volatility. Early redemptions (within 5 years) incur a 2% fee to align investor horizons, after which redemptions are processed daily. Managed by Octanova SCR with seasoned fixed income and blockchain experts, Horizon Fund targets a 15–20% IRR over a six-year term, with full transparency via quarterly reports and annual audited statements.",
  geographicAllocation: [
    { region: "Portugal", percentage: 60 },
    { region: "USA", percentage: 40 }
  ],
  team: [
    { 
      name: "Marcello Cavalcanti", 
      position: "Managing Team",
      photoUrl: "https://randomuser.me/api/portraits/men/35.jpg",
      linkedinUrl: "https://linkedin.com/in/marcello-cavalcanti"
    },
    { 
      name: "Sónia Magalhaes", 
      position: "Managing Team",
      photoUrl: "https://randomuser.me/api/portraits/women/42.jpg",
      linkedinUrl: "https://linkedin.com/in/sonia-magalhaes"
    },
    { 
      name: "Luis Freire", 
      position: "Managing Team",
      photoUrl: "https://randomuser.me/api/portraits/men/28.jpg",
      linkedinUrl: "https://linkedin.com/in/luis-freire"
    },
    { 
      name: "Henrique Anjos", 
      position: "Managing Team",
      photoUrl: "https://randomuser.me/api/portraits/men/56.jpg",
      linkedinUrl: "https://linkedin.com/in/henrique-anjos"
    }
  ],
  documents: [
    { title: "Fund Prospectus", url: "https://example.com/horizon-fund-prospectus.pdf" },
    { title: "Investment Strategy", url: "https://example.com/horizon-fund-strategy.pdf" },
    { title: "Risk Management Framework", url: "https://example.com/horizon-fund-risk.pdf" }
  ],
  historicalPerformance: {
    "2024-09": {
      returns: 2.4,
      aum: 45000000,
      nav: 1.186
    },
    "2024-08": {
      returns: -1.2,
      aum: 44000000,
      nav: 1.158
    },
    "2024-07": {
      returns: 3.8,
      aum: 43500000,
      nav: 1.172
    },
    "2024-06": {
      returns: 1.9,
      aum: 42000000,
      nav: 1.130
    },
    "2024-05": {
      returns: 2.7,
      aum: 41000000,
      nav: 1.109
    },
    "2024-04": {
      returns: -0.8,
      aum: 40500000,
      nav: 1.080
    }
  },
  redemptionTerms: {
    frequency: "Monthly",
    redemptionOpen: true,
    noticePeriod: 0,
    earlyRedemptionFee: 2,
    minimumHoldingPeriod: 60, // 5 years in months
    notes: "Fees apply on any redemption within the first five years; thereafter redemptions processed daily"
  },
  faqs: [
    {
      question: 'What is the Horizon Fund?',
      answer: 'The Horizon Fund is a CMVM-regulated, open-ended investment vehicle managed by Octanova SCR, combining a diversified fixed-income portfolio with large-cap digital assets to pursue superior risk-adjusted returns.'
    },
    {
      question: 'Who manages the Horizon Fund?',
      answer: 'Octanova SCR, S.A., a Portuguese asset manager registered with and supervised by the CMVM, serves as both Investment Manager and Responsible Entity for the fund.'
    },
    {
      question: 'What is the minimum investment commitment?',
      answer: 'The minimum investor commitment to the Horizon Fund (Category A) is €100,000.'
    },
    {
      question: 'What is the target fund size?',
      answer: 'The fund seeks to raise a total of €100 million in committed capital.'
    },
    {
      question: 'Which asset classes does the Horizon Fund invest in?',
      answer: 'It maintains a minimum allocation of 60% of its net asset value in securities of issuers based in Portugal, with up to 40% allocated to large-cap digital assets (e.g., Bitcoin, Ethereum).'
    },
    {
      question: 'How is the fixed-income sleeve structured?',
      answer: 'The bond portfolio is diversified across 16–20 PSI-20 issuers, with a maximum exposure of 10 % per issuer, and is managed to maintain a low-risk profile.'
    },
    {
      question: 'How is the digital-assets allocation managed?',
      answer: 'Digital assets are held via top-tier partners (e.g., Interactive Brokers, Gemini Trust Company), focusing on 1–3 large-cap cryptocurrencies to capture asymmetric upside.'
    },
    {
      question: 'What is the fund\'s investment strategy?',
      answer: 'By blending a stable fixed-income base with a diversified digital-asset sleeve and applying rigorous risk controls (VaR, DV01, stress tests), the Horizon Fund seeks to deliver a projected 15–20 % IRR while limiting downside.'
    },
    {
      question: 'What return profile is targeted?',
      answer: 'The fund projects a 15–20 % annualized internal rate of return through its combined strategy of yield-generating bonds and high-growth digital assets.'
    },
    {
      question: 'What fees apply?',
      answer: 'Subscription fee: 0 %\nSetup fee: 2 % one-off\nManagement fee: 2 % per annum (Category A)\nPerformance fee: 20 % of returns above the fund\'s benchmark hurdle'
    },
    {
      question: 'How liquid is the fund?',
      answer: 'The Horizon Fund is open-ended with monthly subscriptions and redemptions, subject to an early-redemption fee if units are redeemed within the first five years, and NAV is published daily.'
    },
    {
      question: 'What benchmark or hurdle is used for performance fees?',
      answer: 'Performance fees are charged on any net returns exceeding the fund\'s predetermined benchmark return (the specific benchmark is set in the fund\'s prospectus).'
    },
    {
      question: 'Who provides custody and operational support?',
      answer: 'Custodian Bank: Millennium BCP, S.A.\nDigital-asset custody/brokerage: Interactive Brokers & Gemini Trust Company\nLegal & Tax Guidance: Pares Advogados | Antas da Cunha ECIJA'
    },
    {
      question: 'What risk-management processes are in place?',
      answer: 'An active portfolio-management framework employs value-at-risk (VaR), DV01, and stress-testing scenarios, combined with quarterly compliance reviews and ongoing regulator dialogue.'
    },
    {
      question: 'What performance scenarios have been modelled?',
      answer: 'Three scenarios over a 2025–2032 horizon include:\nBase case: 158 % portfolio return (20 % BTC, 5 % bond yield)\nPositive case: 311 % return (56 % BTC, 6.25 % bond yield)\nAdverse case: –19 % return (–21 % BTC, 3 % bond yield)'
    }
  ]
};
