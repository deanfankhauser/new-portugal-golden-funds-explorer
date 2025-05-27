
import { Fund } from '../../types/funds';

export const threeCommaCGoldenIncome: Fund = {
  id: "3cc-golden-income",
  name: "3CC Portugal Golden Income Fund",
  description: "Open-ended Alternative Investment Fund focused on capital preservation with 70% exposure to Portuguese corporate bonds and 30% to global equities & digital assets, offering daily liquidity and eligibility for the Portuguese Golden Visa.",
  category: "Multi-Asset",
  tags: [
    'Golden Visa Eligible', 
    'Bonds', 
    'Equities', 
    'Capital Preservation', 
    'Low Risk', 
    'Liquid', 
    'Daily NAV', 
    'Bitcoin', 
    'Ethereum', 
    'Solana'
  ],
  minimumInvestment: 100000, // Share Class A minimum
  fundSize: 25, // Current AUM in millions
  managementFee: 1.5, // Share Class A
  performanceFee: 20,
  subscriptionFee: 0,
  redemptionFee: 5, // Year 1 rate
  term: 0, // Perpetual (open-ended)
  managerName: "3 Comma Capital SCR, S.A.",
  returnTarget: "10% p.a. expected ROI",
  fundStatus: "Open",
  websiteUrl: "https://example.com/3cc-golden-income",
  established: 2025, // April 2025
  regulatedBy: "CMVM (Portuguese Securities Market Authority)",
  location: "Portugal",
  detailedDescription: "3CC Portugal Golden Income Fund is an open-ended alternative investment vehicle managed by 3 Comma Capital SCR, S.A., structured to satisfy Portuguese Golden Visa requirements by allocating 70% to investment-grade Portuguese corporate bonds and 30% to growth assets—including global equities and digital assets such as Bitcoin, Ethereum, and Solana. Launched in April 2025, it provides daily liquidity with no subscription fee or lock-up. Share Class A (accumulation) requires a €100,000 minimum investment; Class D (distribution) requires €300,000. Both must be held for five years for residency eligibility. Fees comprise a 1.50% management fee for Class A (1.75% for Class D), a 20% performance fee over a 5% high-water mark, and redemption fees tapering from 5% in year 1 to 0% after 5 years + 1 day. The fund targets a 10% p.a. return, currently manages over €25 million (aiming for €50 million), and issues quarterly reports and annual audited statements.",
  geographicAllocation: [
    { region: "Portugal (Bonds)", percentage: 70 },
    { region: "Global Equities", percentage: 15 },
    { region: "Digital Assets", percentage: 15 }
  ],
  team: [
    { 
      name: "Patrick Hable", 
      position: "Co-founder / Anchor Investor / Partner",
      photoUrl: "https://randomuser.me/api/portraits/men/41.jpg",
      linkedinUrl: "https://linkedin.com/in/patrick-hable"
    },
    { 
      name: "Duarte Caldas", 
      position: "Investment Principal",
      photoUrl: "https://randomuser.me/api/portraits/men/42.jpg",
      linkedinUrl: "https://linkedin.com/in/duarte-caldas"
    },
    { 
      name: "José Carlos Monteiro", 
      position: "Head of Operations",
      photoUrl: "https://randomuser.me/api/portraits/men/43.jpg",
      linkedinUrl: "https://linkedin.com/in/jose-carlos-monteiro"
    },
    { 
      name: "Samuel Cavaco", 
      position: "PE/VC Analyst",
      photoUrl: "https://randomuser.me/api/portraits/men/44.jpg",
      linkedinUrl: "https://linkedin.com/in/samuel-cavaco"
    },
    { 
      name: "Nuno Serafim", 
      position: "Co-founder / Managing Partner / CIO",
      photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      linkedinUrl: "https://linkedin.com/in/nuno-serafim"
    },
    { 
      name: "Diana Pereira", 
      position: "Analyst",
      photoUrl: "https://randomuser.me/api/portraits/women/46.jpg",
      linkedinUrl: "https://linkedin.com/in/diana-pereira"
    },
    { 
      name: "Pedro Cerdeira", 
      position: "Partner / Head of VC",
      photoUrl: "https://randomuser.me/api/portraits/men/47.jpg",
      linkedinUrl: "https://linkedin.com/in/pedro-cerdeira"
    },
    { 
      name: "David Duarte", 
      position: "Investment Director",
      photoUrl: "https://randomuser.me/api/portraits/men/48.jpg",
      linkedinUrl: "https://linkedin.com/in/david-duarte"
    },
    { 
      name: "Alexandre Cunha Elias", 
      position: "Business Development Director",
      photoUrl: "https://randomuser.me/api/portraits/men/49.jpg",
      linkedinUrl: "https://linkedin.com/in/alexandre-cunha-elias"
    }
  ],
  documents: [
    { title: "Fund Prospectus", url: "https://example.com/3cc-golden-income-prospectus.pdf" },
    { title: "Performance Report", url: "https://example.com/3cc-golden-income-performance.pdf" },
    { title: "Risk Management Framework", url: "https://example.com/3cc-golden-income-risk.pdf" }
  ],
  redemptionTerms: {
    frequency: "Daily",
    redemptionOpen: true,
    noticePeriod: 5, // 5 business days for processing
    earlyRedemptionFee: 5, // Year 1 rate
    minimumHoldingPeriod: 60, // 5 years in months for Golden Visa
    notes: "Redemption fees taper from 5% in year 1 to 0% after 5 years + 1 day. No lock-up; full liquidity subject to standard processing."
  },
  faqs: [
    {
      question: 'What is the Portugal Golden Income Fund?',
      answer: 'An open-ended Alternative Investment Fund (mutual fund) designed and managed by 3 Comma Capital SCR, S.A., it\'s the first Golden Visa-eligible multi-asset vehicle in Portugal, blending 70 % fixed-income with 30 % growth assets to pursue capital preservation and attractive returns.'
    },
    {
      question: 'Who manages and oversees the fund?',
      answer: 'The fund is managed by 3 Comma Capital SCR, S.A. (CMVM licence no. 182126), a Portuguese regulated asset management and venture capital company, which acts as both Investment Manager and Responsible Entity.'
    },
    {
      question: 'Under what regulatory framework is the fund established?',
      answer: 'It\'s authorised and supervised by the Portuguese Securities Market Commission (CMVM) as an open-ended Alternative Investment Fund, offering daily liquidity under a highly transparent, regulated structure.'
    },
    {
      question: 'What is the target and current assets under management (AuM)?',
      answer: 'The fund targets € 50 million of committed capital; since its April 2025 launch it has onboarded over 60 investors in seven months and expects to surpass € 25 million AuM imminently.'
    },
    {
      question: 'How is the portfolio allocated across asset classes?',
      answer: 'Stability (70 %): Portuguese investment-grade corporate bonds\nGrowth (30 %): 15 % US/World equities and 15 % digital assets (primarily Bitcoin, Ethereum & Solana via regulated crypto vehicles).'
    },
    {
      question: 'What are the fund\'s key investor advantages?',
      answer: 'Open-ended, perpetual structure with no lock-up\nDaily liquidity and daily NAV transparency\nNo subscription fee or other entry costs\nTwo share classes (Accumulation "A" & Distribution "D")\nExpected ROI of 10 % p.a.'
    },
    {
      question: 'What share classes are offered and what are the minimum investments?',
      answer: 'Share Class A (Accumulation): Minimum € 100 000\nShare Class D (Distribution): Minimum € 300 000'
    },
    {
      question: 'What fees and charges apply?',
      answer: 'Subscription fee: 0 %\nManagement fee: 1.50 % p.a. (Class A), 1.75 % p.a. (Class D)\nPerformance fee: 20 % of gains above a 5 % net high-water mark\nRedemption fee: 5 % in Year 1, tapering to 0 % after 5 years + 1 day'
    },
    {
      question: 'What is the fund\'s expected return profile?',
      answer: 'An annualised 10 % p.a. net of fees and costs, based on the historical performance of its underlying benchmarks.'
    },
    {
      question: 'How liquid is the fund?',
      answer: 'Units may be purchased or redeemed daily at the published NAV, with positions integrated directly into investors\' bank account statements.'
    },
    {
      question: 'What investment guidelines and restrictions apply?',
      answer: 'Debt instruments: ≥ 65 % of AUM in EUR-denominated bonds issued by Portuguese corporates\nEquities: 10 %–30 % of AUM via global public-market ETFs\nDigital assets: 0 %–20 % of AUM via regulated crypto funds or ETFs\nBond criteria: Fixed coupon; credit rating > BB-; issuer LQA > 60; issuance > € 500 million; duration < 7 years'
    },
    {
      question: 'How is the bond portfolio constructed?',
      answer: 'A model portfolio of 10–15 bonds, each from a distinct issuer, selected via comprehensive issuer analysis, probability-of-default and loss-given-default studies, and strict risk metrics (CDS, OAS, DV01), reviewed monthly.'
    },
    {
      question: 'What are the portfolio\'s top bond holdings and metrics?',
      answer: 'As of 14-04-2025, holdings include Millennium BCP, Fidelidade PERP, Novobanco, Caixa Geral de Depósitos, EDP, Galp, Crédito Agrícola, REN, with an average modified duration of 3.61 years, yield to maturity of 3.92 %, and a BBB composite rating.'
    },
    {
      question: 'What growth-oriented assets are included?',
      answer: 'US/World equities: S&P 500 and/or MSCI World ETFs for broad market exposure\nDigital assets: via the 3CC Global Crypto Fund or Bitcoin ETFs, with a long-term BTC target of $300 000.'
    },
    {
      question: 'What performance scenarios have been modelled?',
      answer: 'For a € 100 000 investment:\nModerate: € 106 204 after 1 year (6.20 % p.a.), € 173 689 after 5 years (11.67 % p.a.)\nFavorable: € 124 601 after 1 year (24.60 % p.a.), € 249 004 after 5 years (20.02 % p.a.)\nUnfavorable: € 90 127 after 1 year (–9.87 % p.a.), € 120 604 after 5 years (3.82 % p.a.)'
    }
  ]
};
