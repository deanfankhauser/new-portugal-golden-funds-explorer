export type FundTag = 
  // Fees & Yield
  | 'No Fees'
  | 'Low fees (<1% management fee)'
  | 'Target yield 3–5%'
  | 'Target yield 5%+'
  | 'Dividend paying'
  | 'Income-focused'
  // Risk & Objective
  | 'Capital Preservation'
  | 'Capital Growth'
  | 'Balanced'
  | 'High-risk'
  | 'Low-risk'
  | 'Medium-risk'
  | 'Diversified'
  | 'Alternative Investments'
  | 'Special Situations'
  | 'Mixed'
  // Structure & Liquidity
  | 'Open Ended'
  | 'Closed-end Fund'
  | 'UCITS'
  | 'Regulated'
  | 'Secondary Market'
  | 'Daily NAV'
  | 'Liquid'
  | 'No Lock-Up'
  | 'Short lock-up (<5 years)'
  | 'Long lock-up (5–10 years)'
  | 'Long Term'
  | 'Golden Visa Eligible'
  // Sector / Theme
  | 'Bonds'
  | 'Fixed Income'
  | 'Credit'
  | 'Deposits'
  | 'Digital Assets'
  | 'Bitcoin'
  | 'Ethereum'
  | 'Solana'
  | 'Private Markets'
  | 'Industrial'
  | 'Infrastructure'
  | 'Technology'
  | 'Energy'
  | 'Renewable Energy'
  | 'Solar'
  | 'Battery Storage'
  | 'Energy-as-a-Service'
  | 'Cleantech'
  | 'Climate'
  | 'Circular Economy'
  | 'Gold'
  | 'SMEs'
  | 'Tourism'
  | 'Sustainability'
  | 'ESG'
  | 'AI-Driven'
  | 'Healthcare & life sciences'
  | 'Logistics & warehouses'
  | 'Hospitality & hotels'
  | 'Residential real estate'
  | 'Commercial real estate'
  // Tax / Legal
  | 'Tax Free'
  | 'PFIC-Compliant'
  | 'QEF Eligible'
  // Min Subscription
  | 'Min. subscription €100k–250k'
  | 'Min. subscription €250k–€350k'
  | 'Min. subscription €350k–€500k'
  | 'Min. subscription €500k+'
  // Investor Nationality
  | 'Golden Visa funds for U.S. citizens'
  | 'Golden Visa funds for UK citizens'
  | 'Golden Visa funds for Chinese citizens'
  | 'Golden Visa funds for Canadian citizens'
  | 'Golden Visa funds for Australian citizens';

export type FundCategory =
  | 'Venture Capital'
  | 'Private Equity'
  | 'Real Estate'
  | 'Infrastructure'
  | 'Debt'
  | 'Credit'
  | 'Fund-of-Funds'
  | 'Bitcoin'
  | 'Crypto'
  | 'Clean Energy'
  | 'Mixed'
  | 'Other';

export type RiskBand = 'Conservative' | 'Balanced' | 'Aggressive';

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

// Company team member structure (stored in profiles.team_members)
export interface CompanyTeamMember {
  member_id: string; // UUID for linking
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  linkedinUrl?: string;
}

// Fund team member reference (stored in funds.team_members)
export interface FundTeamMemberReference {
  member_id: string; // References CompanyTeamMember
  fund_role?: string; // Optional fund-specific role override
}

// Legacy team member structure (for backward compatibility during migration)
export interface TeamMember {
  name: string;
  position: string;
  bio?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  member_id?: string; // Optional for migration compatibility
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
  fundStatus: 'Open' | 'Soft-closed' | 'Closed' | 'Closing Soon' | 'Liquidated';
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
  
  // New data model fields (Phase 1)
  isin?: string; // International Securities Identification Number
  typicalTicket?: number; // Typical investment ticket size in EUR
  aumAsOfDate?: string; // ISO 8601 date when AUM was measured
  realisedExits?: number; // Number of realised exits from portfolio
  totalDistributions?: number; // Total distributions paid to investors in EUR
  lastDataReviewDate?: string; // ISO 8601 date when data was last manually reviewed
  riskBand?: RiskBand; // 3-band risk classification (Conservative/Balanced/Aggressive)
  
  // Quiz system fields
  isQuizEligible?: boolean; // Controls whether fund appears in Fund Matcher Quiz
  usCompliant?: boolean; // Indicates if fund is compliant for US citizens/residents (PFIC/QEF)
  
  // Social media links
  youtubeUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeVideoUrl?: string;
}
