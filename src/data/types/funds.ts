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
  | 'Golden Visa Eligible'
  | 'Bonds'
  | 'Crypto'
  | 'Liquid'
  | 'Regulated'
  | 'Open Ended'
  | 'Closed Ended'
  | 'Bitcoin'
  | 'Ethereum'
  | 'Solana'
  | 'Equities'
  | 'Balanced'
  | 'UCITS'
  | 'PFIC-Compliant'
  | 'QEF Eligible'
  | 'Daily NAV'
  | 'No Lock-Up'
  | 'Capital Preservation'
  | 'Special Situations'
  | 'SMEs'
  | 'Mid-Cap'
  | 'Lock-Up'
  | 'No Fees'
  | 'Tax Free'
  | 'Capital Growth'
  | 'Gold'
  | 'Deposits'
  | 'AI-Driven'
  | 'Diversified'
  | 'Industrial'
  | 'Circular Economy'
  | 'Equity'
  | 'Debt'
  | 'Secondary Market'
  | 'Long Term'
  | 'Hybrid'
  | 'Dividends'
  | '5 % Yield'
  | 'Renewable Energy'
  | 'Solar'
  | 'Battery Storage'
  | 'Energy-as-a-Service'
  | '12% Return'
  | '5% Dividend'
  | 'Climate'
  | 'Fund subscription minimums'
  | '€250k-€350k (subscription min only; GV still requires €500k total)'
  | '€300k-€400k (subscription min only; GV still requires €500k total)'
  | '€350k-€500k (subscription min only; GV still requires €500k total)'
  | '€400k-€600k (subscription min only; GV still requires €500k total)'
  | '€500k+'
  | 'Low-risk'
  | 'Medium-risk'
  | 'High-risk'
  | '< 3% annual yield'
  | '3-5% annual yield'
  | '> 5% annual yield'
  | '< 5-year lock-up'
  | '5-10 year lock-up'
  | '> 10-year lock-up'
  | '< 1% management fee'
  | '1-1.5% management fee'
  | '> 1.5% management fee'
  | 'Small-cap < €50M'
  | 'Mid-cap €50-100M'
  | 'Large-cap > €100M'
  | 'Golden Visa funds for U.S. citizens'
  | 'Golden Visa funds for Australian citizens'
  | 'Golden Visa funds for UK citizens'
  | 'Golden Visa funds for Canadian citizens'
  | 'Golden Visa funds for Chinese citizens'
  | 'Portugal';

export type FundCategory =
  | 'Venture Capital'
  | 'Private Equity'
  | 'Real Estate'
  | 'Infrastructure'
  | 'Debt'
  | 'Bitcoin'
  | 'Crypto'
  | 'Clean Energy'
  | 'Other';

export type RedemptionFrequency =
  | 'Monthly'
  | 'Quarterly'
  | 'Semi-Annual'
  | 'Annual'
  | 'End of Term'
  | 'Upon Request'
  | 'Not Available'
  | 'Daily'
  | 'Continuous trading';

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

export interface FAQItem {
  question: string;
  answer: string;
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
  returnTarget: string; // e.g., "8-10% annually"
  expectedReturnMin?: number; // Direct access to min return percentage
  expectedReturnMax?: number; // Direct access to max return percentage
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
  faqs?: FAQItem[];
  // Date tracking for content freshness (optional during migration)
  datePublished?: string; // ISO 8601 date when fund was first added
  dateModified?: string; // ISO 8601 date when fund data was last updated
  dataLastVerified?: string; // ISO 8601 date when fund data was last verified against official sources
  performanceDataDate?: string; // ISO 8601 date for performance metrics
  feeLastUpdated?: string; // ISO 8601 date when fees were last changed
  statusLastUpdated?: string; // ISO 8601 date when fund status was last changed
  
  // Additional regulatory and compliance fields
  cmvmId?: string;
  auditor?: string;
  custodian?: string;
  navFrequency?: string;
  pficStatus?: 'QEF available' | 'MTM only' | 'Not provided';
  eligibilityBasis?: {
    portugalAllocation?: number | 'Not provided';
    maturityYears?: number | 'Not provided';
    realEstateExposure?: 'None' | 'Direct' | 'Indirect' | 'Not provided';
    managerAttestation?: boolean;
  };
  
  // Performance and branding fields
  historicalPerformance?: Record<string, {
    returns?: number;
    aum?: number;
    nav?: number;
  }>;
  hurdleRate?: number; // Performance fee hurdle rate percentage
  
  // Ranking (admin-controlled, invisible to end users)
  finalRank?: number;
  updatedAt?: string; // ISO 8601 date when fund was last updated
  
  // Admin-controlled verification (manual)
  isVerified?: boolean;
  verifiedAt?: string; // ISO 8601
  verifiedBy?: string; // Admin user ID
}
