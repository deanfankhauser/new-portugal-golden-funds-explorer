
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
  regulatedBy: "CMVM (Portuguese Securities Supervisor); SEC; FINRA",
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
  }
};
