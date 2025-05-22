
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
  }
};
