
import { Fund } from '../../types/funds';

export const portoInnovationVentures: Fund = {
  id: "portugal-golden-fund-2",
  name: "Porto Innovation Ventures",
  description: "A venture capital fund investing in tech startups across Northern Portugal with a focus on sustainability and innovation.",
  category: "Venture Capital",
  tags: ['Venture Capital', 'Technology', 'High Risk', 'Sustainability'],
  minimumInvestment: 500000,
  fundSize: 25,
  managementFee: 2.5,
  performanceFee: 25,
  subscriptionFee: 2,
  redemptionFee: 3,
  term: 8,
  managerName: "NorthStar Venture Management",
  returnTarget: "12-18% annually",
  fundStatus: "Open",
  websiteUrl: "https://example.com/porto-ventures",
  established: 2020,
  regulatedBy: "CMVM (Portuguese Securities Market Commission)",
  location: "Porto, Portugal",
  detailedDescription: "Porto Innovation Ventures invests in early and growth-stage technology companies based in Northern Portugal. The fund specifically targets startups working in green tech, artificial intelligence, med-tech, and digital transformation. The investment strategy involves taking minority stakes in promising companies with proven products and initial market traction, typically at Series A or B funding rounds. The fund provides not just capital but also strategic guidance, industry connections, and operational support to accelerate growth. The management team includes former successful tech entrepreneurs and experienced venture capitalists with strong networks across Europe and the United States to help portfolio companies scale internationally.",
  geographicAllocation: [
    { region: "Portugal", percentage: 70 },
    { region: "Other EU Countries", percentage: 30 }
  ],
  team: [
    { 
      name: "Luís Carvalho", 
      position: "Managing Partner",
      bio: "Serial tech entrepreneur with two successful exits. Angel investor in over 30 startups.",
      photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      linkedinUrl: "https://linkedin.com/in/luis-carvalho"
    },
    { 
      name: "Sofia Almeida", 
      position: "Investment Partner",
      bio: "Previously at Atomico and Accel Partners. Specialized in SaaS and AI investments.",
      photoUrl: "https://randomuser.me/api/portraits/women/26.jpg",
      linkedinUrl: "https://linkedin.com/in/sofia-almeida"
    },
    { 
      name: "Eduardo Martins", 
      position: "Technical Partner",
      bio: "Former CTO of a unicorn startup. Expert in software architecture and technical due diligence.",
      photoUrl: "https://randomuser.me/api/portraits/men/58.jpg",
      linkedinUrl: "https://linkedin.com/in/eduardo-martins"
    }
  ],
  documents: [
    { title: "Fund Prospectus", url: "https://example.com/porto-ventures-prospectus.pdf" },
    { title: "Investment Strategy", url: "https://example.com/porto-ventures-strategy.pdf" },
    { title: "Portfolio Companies", url: "https://example.com/porto-ventures-portfolio.pdf" }
  ],
  redemptionTerms: {
    frequency: "End of Term",
    redemptionOpen: false,
    noticePeriod: 180,
    earlyRedemptionFee: 5,
    minimumHoldingPeriod: 36,
    notes: "Early redemptions may be allowed in exceptional circumstances at the discretion of the fund manager."
  }
};
