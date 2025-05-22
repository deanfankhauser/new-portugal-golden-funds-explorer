
import { Fund } from '../../types/funds';

export const algarveTourismHospitalityFund: Fund = {
  id: "portugal-golden-fund-3",
  name: "Algarve Tourism & Hospitality Fund",
  description: "A fund specializing in premium tourism assets along Portugal's southern coast, from boutique hotels to high-end resorts.",
  category: "Real Estate",
  tags: ['Real Estate', 'Tourism', 'Medium Risk'],
  minimumInvestment: 500000,
  fundSize: 40,
  managementFee: 1.8,
  performanceFee: 18,
  subscriptionFee: 1,
  redemptionFee: 1.5,
  term: 6,
  managerName: "Southern Hospitality Investments",
  returnTarget: "7-9% annually",
  fundStatus: "Open",
  websiteUrl: "https://example.com/algarve-fund",
  established: 2019,
  regulatedBy: "CMVM (Portuguese Securities Market Commission)",
  location: "Faro, Portugal",
  detailedDescription: "The Algarve Tourism & Hospitality Fund focuses on acquiring, developing, and managing premium tourism-related assets across Portugal's sought-after southern coast. The fund invests in boutique hotels, luxury resorts, high-end vacation rentals, and select tourism experiences. With Portugal's tourism sector showing consistent growth year-over-year (outside the pandemic period), the fund capitalizes on increasing demand for upscale accommodations from both European and global travelers. The investment strategy focuses on properties with strong year-round potential to minimize seasonal fluctuations. The management team brings extensive experience from international hospitality groups and has implemented industry-leading sustainability practices across all properties to appeal to the growing eco-conscious luxury travel segment.",
  geographicAllocation: [
    { region: "Algarve, Portugal", percentage: 75 },
    { region: "Lisbon Coast, Portugal", percentage: 15 },
    { region: "Southern Spain", percentage: 10 }
  ],
  team: [
    { 
      name: "Ricardo Santos", 
      position: "CEO & Fund Manager",
      bio: "25+ years in luxury hospitality development across Mediterranean markets.",
      photoUrl: "https://randomuser.me/api/portraits/men/72.jpg",
      linkedinUrl: "https://linkedin.com/in/ricardo-santos"
    },
    { 
      name: "Helena Costa", 
      position: "Head of Acquisitions",
      bio: "Expert in tourism property valuation with experience at Four Seasons and Marriott development.",
      photoUrl: "https://randomuser.me/api/portraits/women/42.jpg",
      linkedinUrl: "https://linkedin.com/in/helena-costa"
    },
    { 
      name: "Miguel Ferreira", 
      position: "Operations Director",
      bio: "Former Regional Director for a major international hotel chain in Southern Europe.",
      photoUrl: "https://randomuser.me/api/portraits/men/62.jpg",
      linkedinUrl: "https://linkedin.com/in/miguel-ferreira"
    }
  ],
  documents: [
    { title: "Fund Prospectus", url: "https://example.com/algarve-fund-prospectus.pdf" },
    { title: "Tourism Market Analysis", url: "https://example.com/algarve-fund-market-analysis.pdf" },
    { title: "Sustainability Report", url: "https://example.com/algarve-fund-sustainability.pdf" }
  ],
  redemptionTerms: {
    frequency: "Quarterly",
    redemptionOpen: true,
    noticePeriod: 60,
    earlyRedemptionFee: 2.5,
    minimumHoldingPeriod: 12,
    notes: "Quarterly redemption windows subject to a maximum of 10% of fund NAV per quarter."
  }
};
