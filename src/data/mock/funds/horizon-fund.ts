
import { Fund } from '../../types/funds';

export const horizonFund: Fund = {
  id: "horizon-fund",
  name: "Horizon Fund",
  description: "Fund investment in Fixed Income and Digital Assets with access to Golden Visa in Portugal",
  category: "Mixed",
  tags: ['Golden Visa Eligible', 'Bonds', 'Crypto', 'Liquid', 'Low Risk', 'Regulated', 'Open Ended', 'Bitcoin', 'Ethereum', 'Solana'],
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
  location: "Portugal",
  detailedDescription: "Horizon Fund is the first Golden-Visa-eligible SCR vehicle in Portugal, offering a blended strategy of 65% investment-grade Portuguese corporate bonds and 35% large-cap digital assets (e.g. Bitcoin, Ethereum). As an open-ended fund with monthly subscriptions and redemptions, it provides both liquidity and stability: bond holdings generate steady income while crypto allocations capture growth potential. A robust risk-management framework—including stop-loss triggers, liquidity buffers and independent oversight—helps control volatility. Early redemptions (within 5 years) incur a 2% fee to align investor horizons, after which redemptions are processed daily. Managed by Octanova SCR with seasoned fixed income and blockchain experts, Horizon Fund targets a 15–20% IRR over a six-year term, with full transparency via quarterly reports and annual audited statements.",
  geographicAllocation: [
    { region: "Portugal", percentage: 35 },
    { region: "USA", percentage: 65 }
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
  redemptionTerms: {
    frequency: "Monthly",
    redemptionOpen: true,
    noticePeriod: 0,
    earlyRedemptionFee: 2,
    minimumHoldingPeriod: 60, // 5 years in months
    notes: "Fees apply on any redemption within the first five years; thereafter redemptions processed daily"
  }
};
