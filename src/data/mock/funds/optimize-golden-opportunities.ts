
import { Fund } from '../../types/funds';

export const optimizeGoldenOpportunities: Fund = {
  id: "optimize-golden-opportunities",
  name: "Optimize Portugal Golden Opportunities Fund",
  description: "Open-ended UCITS-compliant balanced fund investing in Portuguese listed equities and bonds, offering daily liquidity and eligibility for the Portuguese Golden Visa.",
  category: "Balanced",
  tags: [
    'Golden Visa Eligible', 
    'Equities', 
    'Bonds', 
    'Balanced', 
    'Liquid', 
    'UCITS', 
    'PFIC-Compliant', 
    'QEF Eligible',
    'Daily NAV',
    'No Lock-Up',
    'Open Ended'
  ],
  minimumInvestment: 500000,
  fundSize: 0, // N/A in the provided data
  managementFee: 0, // N/A in the provided data
  performanceFee: 0, // N/A in the provided data
  subscriptionFee: 0, // N/A in the provided data
  redemptionFee: 0,
  term: 0, // Perpetual (open-ended)
  managerName: "Optimize Investment Partners",
  returnTarget: "Past performance: +4.2% (2022), +17.3% (2023), +6.3% (2024), +8.4% YTD (Apr 2025)",
  fundStatus: "Open",
  websiteUrl: "https://example.com/optimize-golden-opportunities",
  established: 2008, // Using the founding date of the manager
  regulatedBy: "CMVM (Portuguese Securities Supervisor)",
  location: "Portugal",
  detailedDescription: "Optimize Portugal Golden Opportunities Fund is a UCITS-compliant, open-ended vehicle designed for Golden Visa investors, blending a 75% allocation to Portuguese listed equities with 25% in bonds to achieve lower volatility and attractive long-term capital appreciation. The fund provides daily NAV and processing of subscriptions/redemptions within five business days, with no lock-up period or redemption fees. Investors benefit from PFIC compliance and the ability for U.S. persons to elect QEF treatment. The minimum investment of €500,000 (€505,255 including taxes and commissions) must be maintained for five years to satisfy Golden Visa requirements. Past performance (net of fees) includes +4.2% in 2022, +17.3% in 2023, +6.3% in 2024, and +8.4% year-to-date through April 30, 2025.",
  geographicAllocation: [
    { region: "Portugal", percentage: 100 }
  ],
  documents: [
    { title: "Fund Prospectus", url: "https://example.com/optimize-prospectus.pdf" },
    { title: "Performance Report", url: "https://example.com/optimize-performance.pdf" },
    { title: "UCITS Compliance", url: "https://example.com/optimize-ucits.pdf" }
  ],
  redemptionTerms: {
    frequency: "Daily",
    redemptionOpen: true,
    noticePeriod: 5, // 5 business days for processing
    earlyRedemptionFee: 0,
    minimumHoldingPeriod: 60, // 5 years in months (for Golden Visa)
    notes: "No lock-up, no penalties, full liquidity subject to business-day processing. The minimum investment must be maintained for five years to satisfy Golden Visa requirements."
  },
  faqs: [
    {
      question: 'What is the Portugal Golden Opportunities Fund?',
      answer: 'An open-ended, UCITS-compliant multi-asset fund designed to meet Portugal\'s Golden Visa ARI requirements by investing exclusively in publicly traded stocks and bonds—no real estate exposure.'
    },
    {
      question: 'Who manages the fund?',
      answer: 'It\'s managed by Optimize Investment Partners, a Portuguese asset management company (CMVM Reg. No. 327) founded in 2008, with €380 million AUM across 18 funds and over 25,000 clients.'
    },
    {
      question: 'What minimum investment is required?',
      answer: 'A € 500,000 qualifying investment (plus approx. €5,255 in taxes/fees) is required to subscribe, which also satisfies the Golden Visa threshold.'
    },
    {
      question: 'How is the portfolio allocated?',
      answer: 'The target allocation is 75 % fixed-income (investment-grade corporate bonds) and 25 % equities (listed Portuguese stocks) to balance return and volatility.'
    },
    {
      question: 'What asset classes does the fund hold?',
      answer: 'Only publicly traded Portuguese corporate bonds and Portuguese-listed equities—no direct or indirect real estate positions.'
    },
    {
      question: 'What geographic exposure do portfolio companies have?',
      answer: 'All issuers are Portuguese, yet the underlying companies generate approximately 50 % of their revenues outside Portugal, adding international diversification.'
    },
    {
      question: 'How has the fund performed to date?',
      answer: 'Annual returns have been +4.2 % in 2022, +17.3 % in 2023, +6.3 % in 2024, and +8.4 % through April 30, 2025.'
    },
    {
      question: 'How liquid is the fund?',
      answer: 'Open-ended with daily liquidity—investors may redeem units within five business days at the published NAV.'
    },
    {
      question: 'What are the fund\'s main advantages?',
      answer: '• Broad diversification across issuers, sectors and asset classes\n• Lower volatility via corporate bonds\n• Daily NAV transparency and liquidity\n• PFIC- and FATCA-compliant for U.S. investors\n• Direct IRA investment possible'
    },
    {
      question: 'Is the fund PFIC- and FATCA-compliant?',
      answer: 'Yes—fully PFIC-compliant and FATCA-registered, simplifying U.S. tax reporting and allowing QEF elections.'
    },
    {
      question: 'Under what regulatory framework does it operate?',
      answer: 'A UCITS fund regulated by the Portuguese Securities Market Commission (CMVM) under EU directives.'
    },
    {
      question: 'How do I subscribe?',
      answer: 'Simply open an Optimize asset-management account (no need for a Portuguese bank account if you qualify for the Optimize special advantage), then transfer your € 500,000 investment.'
    },
    {
      question: 'Who is eligible to invest?',
      answer: 'The fund is open to all nationalities, with a streamlined process for investors from the U.S., Canada, Australia, New Zealand, Hong Kong, South Africa, Turkey, South Korea, Indonesia, Brazil, Taiwan, Japan, UK, Uruguay, Singapore, Israel and Malaysia.'
    },
    {
      question: 'Does the fund include any real-estate exposure?',
      answer: 'No—by design it holds only listed securities, ensuring full compliance with the ARI requirement of zero real-estate investment.'
    },
    {
      question: 'Is there any lock-up or term limit?',
      answer: 'No lock-up—this is a perpetual, open-ended fund you can redeem at any time (subject to the five-business-day settlement).'
    }
  ]
};
