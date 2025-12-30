/**
 * Indexability Gate - Core module
 * 
 * Centralized logic to determine if a page should be indexed by search engines.
 * This ensures sitemap inclusion and robots meta tags are always in sync.
 */

export interface IndexabilityResult {
  isIndexable: boolean;
  reason?: IndexabilityReason;
  robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
}

export type IndexabilityReason =
  | 'indexable'
  | 'missing_required_fields'
  | 'thin_content'
  | 'placeholder_data'
  | 'zero_funds'
  | 'non_canonical_variant'
  | 'low_value_comparison'
  | 'missing_fund'
  | 'gone_page';

// Configuration thresholds per page type
export const INDEXABILITY_CONFIG = {
  fund: {
    minDescriptionChars: 50,
    requiredFields: ['name', 'category'] as const,
    minInvestmentRequired: true,
  },
  manager: {
    minFunds: 1,
  },
  category: {
    minFunds: 1,
  },
  tag: {
    minFunds: 1,
  },
  comparison: {
    requiresBothFunds: true,
    requiresCanonicalSlug: true,
    excludeLowValue: true,
  },
  teamMember: {
    minBioChars: 20,
    requiredFields: ['name', 'role'] as const,
  },
  homepage: {
    alwaysIndex: true,
  },
} as const;

// Re-export check functions for convenience
export {
  checkFundIndexability,
  checkManagerIndexability,
  checkCategoryIndexability,
  checkTagIndexability,
  checkComparisonIndexability,
  checkTeamMemberIndexability,
  checkHomepageIndexability,
} from './checks';
