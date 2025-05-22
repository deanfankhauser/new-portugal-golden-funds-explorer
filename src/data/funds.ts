export type FundTag = 
  | 'Real Estate'
  | 'Private Equity'
  | 'Venture Capital'
  | 'Tourism'
  | 'Infrastructure'
  | 'Technology'
  | 'Healthcare'
  | 'Energy'
  | 'Sustainability'
  | 'Low Risk'
  | 'Medium Risk'
  | 'High Risk';

export type FundCategory =
  | 'Venture Capital'
  | 'Private Equity'
  | 'Real Estate'
  | 'Mixed'
  | 'Infrastructure'
  | 'Debt';

export interface GeographicAllocation {
  region: string;
  percentage: number;
}

export interface TeamMember {
  name: string;
  position: string;
  bio?: string;
  photoUrl?: string;
  linkedinUrl?: string;
}

export interface PdfDocument {
  title: string;
  url: string;
}

export interface Fund {
  id: string;
  name: string;
  description: string;
  tags: FundTag[];
  category: FundCategory;
  minimumInvestment: number; // in EUR
  fundSize: number; // in EUR millions
  managementFee: number; // percentage
  performanceFee: number; // percentage
  subscriptionFee?: number; // percentage
  redemptionFee?: number; // percentage
  term: number; // in years
  managerName: string;
  managerLogo?: string;
  returnTarget: string; // e.g., "8-10% annually"
  fundStatus: 'Open' | 'Closed' | 'Closing Soon';
  websiteUrl?: string;
  established: number; // year
  regulatedBy: string;
  location: string;
  detailedDescription: string;
  geographicAllocation?: GeographicAllocation[];
  team?: TeamMember[];
  documents?: PdfDocument[];
}

// Sample fund data
export const funds: Fund[] = [
  {
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
    ]
  },
  {
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
    ]
  },
  {
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
    ]
  }
];

// Function to get all unique tags from funds
export const getAllTags = (): FundTag[] => {
  const tagsSet = new Set<FundTag>();
  funds.forEach(fund => {
    fund.tags.forEach(tag => {
      tagsSet.add(tag);
    });
  });
  return Array.from(tagsSet);
};

// Function to get funds by tag
export const getFundsByTag = (tag: FundTag): Fund[] => {
  return funds.filter(fund => fund.tags.includes(tag));
};

// Function to get a fund by ID
export const getFundById = (id: string): Fund | undefined => {
  return funds.find(fund => fund.id === id);
};

// Function to search funds
export const searchFunds = (query: string): Fund[] => {
  const lowerCaseQuery = query.toLowerCase();
  return funds.filter(fund => 
    fund.name.toLowerCase().includes(lowerCaseQuery) ||
    fund.description.toLowerCase().includes(lowerCaseQuery) ||
    fund.managerName.toLowerCase().includes(lowerCaseQuery)
  );
};
