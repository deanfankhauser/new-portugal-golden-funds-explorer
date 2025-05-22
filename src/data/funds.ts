
// Re-export types
export type {
  Fund,
  FundTag,
  FundCategory,
  GeographicAllocation,
  TeamMember,
  PdfDocument
} from './types/funds';

// Re-export funds data
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
