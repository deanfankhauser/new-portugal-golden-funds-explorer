// Re-export types
export type {
  Fund,
  FundTag,
  FundCategory,
  GeographicAllocation,
  TeamMember,
  PdfDocument
} from './types/funds';

// Re-export funds data (now with investment tags)
export { funds } from './services/funds-service';

// Re-export tag related functions
export { 
  getAllTags,
  getFundsByTag
} from './services/tags-service';

// Re-export category related functions
export {
  getAllCategories,
  getFundsByCategory
} from './services/categories-service';

// Re-export fund related functions
export {
  getFundById,
  searchFunds
} from './services/funds-service';

// Re-export investment-related functions
export {
  generateInvestmentTags,
  getFundsByInvestmentRange,
  getFundsUnderAmount
} from './services/investment-tags-service';

// Re-export risk-related functions
export {
  generateRiskTags,
  getFundsByRiskLevel
} from './services/risk-tags-service';

// Re-export APY-related functions
export {
  generateAPYTags,
  getFundsByAPYLevel
} from './services/apy-tags-service';

// Re-export lock-up period related functions
export {
  generateLockupTags,
  getFundsByLockupPeriod
} from './services/lockup-tags-service';

// Re-export management fee related functions
export {
  generateManagementFeeTags,
  getFundsByManagementFeeLevel
} from './services/management-fee-tags-service';

// Re-export fund size related functions
export {
  generateFundSizeTags,
  getFundsByFundSizeLevel
} from './services/fund-size-tags-service';

// Re-export audience segment related functions
export {
  generateAudienceTags,
  getFundsByAudienceSegment
} from './services/audience-tags-service';
