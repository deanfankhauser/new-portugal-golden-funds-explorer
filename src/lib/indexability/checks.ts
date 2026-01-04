/**
 * Indexability Gate - Check functions
 * 
 * Page-type-specific functions to determine indexability.
 * Used by both SEO helpers (for robots meta) and sitemap generator.
 */

import { Fund } from '@/data/types/funds';
import { IndexabilityResult, INDEXABILITY_CONFIG } from './index';
import { normalizeComparisonSlug, isLowValueComparison } from '@/utils/comparisonUtils';

/**
 * Check if a fund page should be indexed
 */
export function checkFundIndexability(fund: Fund | null | undefined): IndexabilityResult {
  if (!fund) {
    return { 
      isIndexable: false, 
      reason: 'missing_required_fields', 
      robots: 'noindex, follow' 
    };
  }

  const config = INDEXABILITY_CONFIG.fund;

  // Check 1: Has required fields
  if (!fund.name || !fund.category) {
    return { 
      isIndexable: false, 
      reason: 'missing_required_fields', 
      robots: 'noindex, follow' 
    };
  }

  // Check 2: Has meaningful description (min 50 chars combined)
  const descLength = (fund.description || '').length + (fund.detailedDescription || '').length;
  if (descLength < config.minDescriptionChars) {
    return { 
      isIndexable: false, 
      reason: 'thin_content', 
      robots: 'noindex, follow' 
    };
  }

  // Check 3: Has minimum investment (not placeholder 0 or null)
  if (config.minInvestmentRequired && (!fund.minimumInvestment || fund.minimumInvestment === 0)) {
    return { 
      isIndexable: false, 
      reason: 'placeholder_data', 
      robots: 'noindex, follow' 
    };
  }

  return { 
    isIndexable: true, 
    reason: 'indexable', 
    robots: 'index, follow' 
  };
}

/**
 * Check if a manager page should be indexed
 */
export function checkManagerIndexability(
  managerName: string | null | undefined, 
  funds: Fund[]
): IndexabilityResult {
  if (!managerName) {
    return { 
      isIndexable: false, 
      reason: 'missing_required_fields', 
      robots: 'noindex, follow' 
    };
  }

  // Filter funds belonging to this manager
  const managerFunds = funds.filter(f => 
    f.managerName?.toLowerCase().trim() === managerName.toLowerCase().trim()
  );

  if (managerFunds.length < INDEXABILITY_CONFIG.manager.minFunds) {
    return { 
      isIndexable: false, 
      reason: 'zero_funds', 
      robots: 'noindex, follow' 
    };
  }

  return { 
    isIndexable: true, 
    reason: 'indexable', 
    robots: 'index, follow' 
  };
}

/**
 * Check if a category page should be indexed
 */
export function checkCategoryIndexability(
  categoryName: string | null | undefined, 
  funds: Fund[]
): IndexabilityResult {
  if (!categoryName) {
    return { 
      isIndexable: false, 
      reason: 'missing_required_fields', 
      robots: 'noindex, follow' 
    };
  }

  // Filter funds in this category
  const categoryFunds = funds.filter(f => 
    f.category?.toLowerCase() === categoryName.toLowerCase()
  );

  if (categoryFunds.length < INDEXABILITY_CONFIG.category.minFunds) {
    return { 
      isIndexable: false, 
      reason: 'zero_funds', 
      robots: 'noindex, follow' 
    };
  }

  return { 
    isIndexable: true, 
    reason: 'indexable', 
    robots: 'index, follow' 
  };
}

/**
 * Check if a tag page should be indexed
 */
export function checkTagIndexability(
  tagName: string | null | undefined, 
  funds: Fund[]
): IndexabilityResult {
  if (!tagName) {
    return { 
      isIndexable: false, 
      reason: 'missing_required_fields', 
      robots: 'noindex, follow' 
    };
  }

  // Normalize tag for comparison (handle slug format)
  const normalizedTag = tagName.toLowerCase().replace(/-/g, ' ');

  // Filter funds with this tag
  const tagFunds = funds.filter(f => 
    f.tags?.some(t => t.toLowerCase().replace(/-/g, ' ') === normalizedTag)
  );

  if (tagFunds.length < INDEXABILITY_CONFIG.tag.minFunds) {
    return { 
      isIndexable: false, 
      reason: 'zero_funds', 
      robots: 'noindex, follow' 
    };
  }

  return { 
    isIndexable: true, 
    reason: 'indexable', 
    robots: 'index, follow' 
  };
}

/**
 * Check if a comparison page should be indexed
 */
export function checkComparisonIndexability(
  fund1: Fund | null | undefined,
  fund2: Fund | null | undefined,
  slug: string
): IndexabilityResult {
  // Check 1: Both funds must exist
  if (!fund1 || !fund2) {
    return { 
      isIndexable: false, 
      reason: 'missing_fund', 
      robots: 'noindex, follow' 
    };
  }

  // Check 2: Must be canonical slug (A-vs-B not B-vs-A)
  const normalizedSlug = normalizeComparisonSlug(slug);
  if (slug !== normalizedSlug) {
    return { 
      isIndexable: false, 
      reason: 'non_canonical_variant', 
      robots: 'noindex, follow' 
    };
  }

  // Check 3: Not a low-value comparison
  if (isLowValueComparison(fund1, fund2)) {
    return { 
      isIndexable: false, 
      reason: 'low_value_comparison', 
      robots: 'noindex, follow' 
    };
  }

  return { 
    isIndexable: true, 
    reason: 'indexable', 
    robots: 'index, follow' 
  };
}

/**
 * Check if a team member page should be indexed
 */
export function checkTeamMemberIndexability(
  member: { name?: string; role?: string; bio?: string } | null | undefined
): IndexabilityResult {
  if (!member) {
    return { 
      isIndexable: false, 
      reason: 'missing_required_fields', 
      robots: 'noindex, follow' 
    };
  }

  const config = INDEXABILITY_CONFIG.teamMember;

  // Check 1: Has required fields
  if (!member.name || !member.role) {
    return { 
      isIndexable: false, 
      reason: 'missing_required_fields', 
      robots: 'noindex, follow' 
    };
  }

  // Check 2: Has minimal bio content
  const bioLength = (member.bio || '').length;
  if (bioLength < config.minBioChars) {
    return { 
      isIndexable: false, 
      reason: 'thin_content', 
      robots: 'noindex, follow' 
    };
  }

  return { 
    isIndexable: true, 
    reason: 'indexable', 
    robots: 'index, follow' 
  };
}

/**
 * Homepage is always indexable
 */
export function checkHomepageIndexability(): IndexabilityResult {
  return { 
    isIndexable: true, 
    reason: 'indexable', 
    robots: 'index, follow' 
  };
}
