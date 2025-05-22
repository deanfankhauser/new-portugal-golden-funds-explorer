
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
  | 'High Risk'
  | 'Golden Visa Eligible'
  | 'Bonds'
  | 'Crypto'
  | 'Liquid'
  | 'Regulated'
  | 'Open Ended'
  | 'Bitcoin'
  | 'Ethereum'
  | 'Solana';

export type FundCategory =
  | 'Venture Capital'
  | 'Private Equity'
  | 'Real Estate'
  | 'Mixed'
  | 'Infrastructure'
  | 'Debt'
  | 'Fixed Income & Digital Assets';

export type RedemptionFrequency =
  | 'Monthly'
  | 'Quarterly'
  | 'Semi-Annual'
  | 'Annual'
  | 'End of Term'
  | 'Upon Request'
  | 'Not Available';

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

export interface RedemptionTerms {
  frequency: RedemptionFrequency;
  redemptionOpen: boolean;
  noticePeriod?: number; // in days
  earlyRedemptionFee?: number; // percentage
  minimumHoldingPeriod?: number; // in months
  notes?: string;
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
  redemptionTerms?: RedemptionTerms;
}
