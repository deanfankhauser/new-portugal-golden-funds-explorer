
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

export interface Fund {
  id: string;
  name: string;
  description: string;
  tags: FundTag[];
  minimumInvestment: number; // in EUR
  fundSize: number; // in EUR millions
  managementFee: number; // percentage
  performanceFee: number; // percentage
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
}

// Sample fund data
export const funds: Fund[] = [
  {
    id: "portugal-golden-fund-1",
    name: "Lisboa Real Estate Growth Fund",
    description: "A fund focused on premium real estate development in Lisbon's historic center and emerging neighborhoods.",
    tags: ['Real Estate', 'Low Risk'],
    minimumInvestment: 500000,
    fundSize: 50, // 50 million EUR
    managementFee: 2,
    performanceFee: 20,
    term: 7,
    managerName: "Lisbon Capital Partners",
    returnTarget: "6-8% annually",
    fundStatus: "Open",
    websiteUrl: "https://example.com/lisboa-fund",
    established: 2018,
    regulatedBy: "CMVM (Portuguese Securities Market Commission)",
    location: "Lisbon, Portugal",
    detailedDescription: "The Lisboa Real Estate Growth Fund invests in premium residential and commercial properties in Lisbon's historic center and emerging neighborhoods. The fund targets properties with renovation potential to create value through modernization while preserving historical elements. With a careful selection process, the fund focuses on properties in strategic locations with high rental demand from both locals and the international community. The fund managers have over 20 years of experience in the Portuguese real estate market and maintain a conservative approach to leverage, generally not exceeding 50% loan-to-value across the portfolio. All properties are managed by a dedicated property management team ensuring high occupancy rates and premium rental yields."
  },
  {
    id: "portugal-golden-fund-2",
    name: "Porto Innovation Ventures",
    description: "A venture capital fund investing in tech startups across Northern Portugal with a focus on sustainability and innovation.",
    tags: ['Venture Capital', 'Technology', 'High Risk', 'Sustainability'],
    minimumInvestment: 500000,
    fundSize: 25,
    managementFee: 2.5,
    performanceFee: 25,
    term: 8,
    managerName: "NorthStar Venture Management",
    returnTarget: "12-18% annually",
    fundStatus: "Open",
    websiteUrl: "https://example.com/porto-ventures",
    established: 2020,
    regulatedBy: "CMVM (Portuguese Securities Market Commission)",
    location: "Porto, Portugal",
    detailedDescription: "Porto Innovation Ventures invests in early and growth-stage technology companies based in Northern Portugal. The fund specifically targets startups working in green tech, artificial intelligence, med-tech, and digital transformation. The investment strategy involves taking minority stakes in promising companies with proven products and initial market traction, typically at Series A or B funding rounds. The fund provides not just capital but also strategic guidance, industry connections, and operational support to accelerate growth. The management team includes former successful tech entrepreneurs and experienced venture capitalists with strong networks across Europe and the United States to help portfolio companies scale internationally."
  },
  {
    id: "portugal-golden-fund-3",
    name: "Algarve Tourism & Hospitality Fund",
    description: "A fund specializing in premium tourism assets along Portugal's southern coast, from boutique hotels to high-end resorts.",
    tags: ['Real Estate', 'Tourism', 'Medium Risk'],
    minimumInvestment: 500000,
    fundSize: 40,
    managementFee: 1.8,
    performanceFee: 18,
    term: 6,
    managerName: "Southern Hospitality Investments",
    returnTarget: "7-9% annually",
    fundStatus: "Open",
    websiteUrl: "https://example.com/algarve-fund",
    established: 2019,
    regulatedBy: "CMVM (Portuguese Securities Market Commission)",
    location: "Faro, Portugal",
    detailedDescription: "The Algarve Tourism & Hospitality Fund focuses on acquiring, developing, and managing premium tourism-related assets across Portugal's sought-after southern coast. The fund invests in boutique hotels, luxury resorts, high-end vacation rentals, and select tourism experiences. With Portugal's tourism sector showing consistent growth year-over-year (outside the pandemic period), the fund capitalizes on increasing demand for upscale accommodations from both European and global travelers. The investment strategy focuses on properties with strong year-round potential to minimize seasonal fluctuations. The management team brings extensive experience from international hospitality groups and has implemented industry-leading sustainability practices across all properties to appeal to the growing eco-conscious luxury travel segment."
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
