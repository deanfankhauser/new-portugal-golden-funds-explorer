
import { Fund } from '../../types/funds';

export const lisboaRealEstateGrowthFund: Fund = {
  id: "portugal-golden-fund-1",
  name: "Lisboa Real Estate Growth Fund",
  description: "A fund focused on premium real estate development in Lisbon's historic center and emerging neighborhoods.",
  category: "Real Estate",
  tags: ['Real Estate', 'Low Risk'],
  minimumInvestment: 500000,
  fundSize: 50, // 50 million EUR
  managementFee: 2,
  performanceFee: 20,
  subscriptionFee: 1.5,
  redemptionFee: 2,
  term: 7,
  managerName: "Lisbon Capital Partners",
  returnTarget: "6-8% annually",
  fundStatus: "Open",
  websiteUrl: "https://example.com/lisboa-fund",
  established: 2018,
  regulatedBy: "CMVM (Portuguese Securities Market Commission)",
  location: "Lisbon, Portugal",
  detailedDescription: "The Lisboa Real Estate Growth Fund invests in premium residential and commercial properties in Lisbon's historic center and emerging neighborhoods. The fund targets properties with renovation potential to create value through modernization while preserving historical elements. With a careful selection process, the fund focuses on properties in strategic locations with high rental demand from both locals and the international community. The fund managers have over 20 years of experience in the Portuguese real estate market and maintain a conservative approach to leverage, generally not exceeding 50% loan-to-value across the portfolio. All properties are managed by a dedicated property management team ensuring high occupancy rates and premium rental yields.",
  geographicAllocation: [
    { region: "Portugal", percentage: 85 },
    { region: "Spain", percentage: 15 }
  ],
  team: [
    { 
      name: "António Silva", 
      position: "Fund Manager",
      bio: "Over 20 years of experience in Portuguese real estate investment. Previously worked at CBRE and Savills.",
      photoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      linkedinUrl: "https://linkedin.com/in/antonio-silva"
    },
    { 
      name: "Maria Fernandes", 
      position: "Investment Director",
      bio: "15 years experience in real estate development and asset management across Southern Europe.",
      photoUrl: "https://randomuser.me/api/portraits/women/17.jpg",
      linkedinUrl: "https://linkedin.com/in/maria-fernandes"
    },
    { 
      name: "João Pereira", 
      position: "Legal Counsel",
      bio: "Specialized in Portuguese real estate law and Golden Visa regulations.",
      photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      linkedinUrl: "https://linkedin.com/in/joao-pereira"
    }
  ],
  documents: [
    { title: "Fund Prospectus", url: "https://example.com/lisboa-fund-prospectus.pdf" },
    { title: "Annual Report 2024", url: "https://example.com/lisboa-fund-annual-report-2024.pdf" },
    { title: "Golden Visa Eligibility", url: "https://example.com/lisboa-fund-golden-visa-eligibility.pdf" }
  ],
  redemptionTerms: {
    frequency: "Annual",
    redemptionOpen: true,
    noticePeriod: 90,
    earlyRedemptionFee: 3,
    minimumHoldingPeriod: 24,
    notes: "Redemptions processed on the last business day of each calendar year, subject to fund liquidity."
  }
};
