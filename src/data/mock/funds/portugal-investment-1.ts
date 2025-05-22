
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
  }
};
