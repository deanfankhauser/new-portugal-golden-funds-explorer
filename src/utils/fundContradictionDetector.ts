import { Fund, RedemptionTerms } from '@/data/types/funds';

export type ContradictionSeverity = 'error' | 'warning';
export type ContradictionLocation = 'description' | 'detailedDescription' | 'auto-generated';

export interface Contradiction {
  field: string;
  structuredValue: string;
  conflictingText: string;
  location: ContradictionLocation;
  severity: ContradictionSeverity;
  message: string;
}

export interface ContradictionResult {
  hasContradictions: boolean;
  errorCount: number;
  warningCount: number;
  contradictions: Contradiction[];
}

interface ContradictionRule {
  id: string;
  field: string;
  check: (fund: Fund) => boolean; // Returns true if rule applies (structured data says X)
  patterns: RegExp[];
  getMessage: (fund: Fund) => { structuredValue: string; message: string };
  severity: ContradictionSeverity;
}

// Define contradiction rules
const contradictionRules: ContradictionRule[] = [
  // Daily liquidity claims when not daily redemption
  {
    id: 'daily-liquidity',
    field: 'redemptionTerms.frequency',
    check: (fund) => {
      const freq = fund.redemptionTerms?.frequency?.toLowerCase();
      return freq !== 'daily' && freq !== 'continuous trading';
    },
    patterns: [
      /\bdaily\s+liquidity\b/i,
      /\bdaily\s+redemption/i,
      /\bredeem\s+daily\b/i,
      /\bwith\s+daily\s+liquidity\b/i,
    ],
    getMessage: (fund) => ({
      structuredValue: fund.redemptionTerms?.frequency || 'Not Daily',
      message: `Copy claims "daily liquidity" but redemption frequency is "${fund.redemptionTerms?.frequency || 'not specified'}"`,
    }),
    severity: 'error',
  },
  
  // Weekly liquidity claims when less frequent
  {
    id: 'weekly-liquidity',
    field: 'redemptionTerms.frequency',
    check: (fund) => {
      const freq = fund.redemptionTerms?.frequency?.toLowerCase();
      const moreFrequent = ['daily', 'continuous trading'];
      return !moreFrequent.includes(freq || '') && freq !== 'weekly';
    },
    patterns: [
      /\bweekly\s+liquidity\b/i,
      /\bweekly\s+redemption/i,
    ],
    getMessage: (fund) => ({
      structuredValue: fund.redemptionTerms?.frequency || 'Not Weekly',
      message: `Copy claims "weekly liquidity" but redemption frequency is "${fund.redemptionTerms?.frequency || 'not specified'}"`,
    }),
    severity: 'error',
  },
  
  // No lock-up claims when there is a holding period
  {
    id: 'no-lockup',
    field: 'redemptionTerms.minimumHoldingPeriod',
    check: (fund) => {
      const holdingPeriod = fund.redemptionTerms?.minimumHoldingPeriod;
      return holdingPeriod !== undefined && holdingPeriod !== null && holdingPeriod > 0;
    },
    patterns: [
      /\bno\s+lock[-\s]?up\b/i,
      /\bno\s+lockup\b/i,
      /\binstant\s+liquidity\b/i,
      /\bimmediate\s+liquidity\b/i,
      /\bno\s+minimum\s+holding\b/i,
    ],
    getMessage: (fund) => ({
      structuredValue: `${fund.redemptionTerms?.minimumHoldingPeriod} months`,
      message: `Copy claims "no lock-up" but minimum holding period is ${fund.redemptionTerms?.minimumHoldingPeriod} months`,
    }),
    severity: 'error',
  },
  
  // No management fee claims when fee exists
  {
    id: 'no-management-fee',
    field: 'managementFee',
    check: (fund) => {
      return fund.managementFee !== undefined && fund.managementFee !== null && fund.managementFee > 0;
    },
    patterns: [
      /\bno\s+management\s+fee/i,
      /\bzero\s+management\s+fee/i,
      /\bfee[-\s]?free\b/i,
      /\b0%\s+management\b/i,
    ],
    getMessage: (fund) => ({
      structuredValue: `${fund.managementFee}%`,
      message: `Copy claims "no management fee" but management fee is ${fund.managementFee}%`,
    }),
    severity: 'error',
  },
  
  // No performance fee claims when fee exists
  {
    id: 'no-performance-fee',
    field: 'performanceFee',
    check: (fund) => {
      return fund.performanceFee !== undefined && fund.performanceFee !== null && fund.performanceFee > 0;
    },
    patterns: [
      /\bno\s+performance\s+fee/i,
      /\bzero\s+performance\s+fee/i,
      /\b0%\s+performance\b/i,
    ],
    getMessage: (fund) => ({
      structuredValue: `${fund.performanceFee}%`,
      message: `Copy claims "no performance fee" but performance fee is ${fund.performanceFee}%`,
    }),
    severity: 'error',
  },
  
  // Open-ended claims when fund is closed-end
  {
    id: 'open-ended',
    field: 'tags',
    check: (fund) => {
      return fund.tags?.includes('Closed-end Fund') || false;
    },
    patterns: [
      /\bopen[-\s]?ended\b/i,
      /\bopen\s+ended\s+fund\b/i,
    ],
    getMessage: (fund) => ({
      structuredValue: 'Closed-end Fund',
      message: `Copy claims "open-ended" but fund is tagged as closed-end`,
    }),
    severity: 'error',
  },
  
  // Closed-end claims when fund is open-ended
  {
    id: 'closed-ended',
    field: 'tags',
    check: (fund) => {
      return fund.tags?.includes('Open Ended') || false;
    },
    patterns: [
      /\bclosed[-\s]?end(?:ed)?\s+fund\b/i,
    ],
    getMessage: (fund) => ({
      structuredValue: 'Open Ended',
      message: `Copy claims "closed-end" but fund is tagged as open-ended`,
    }),
    severity: 'error',
  },
  
  // No lock-up tag contradiction with holding period
  {
    id: 'tag-lockup-mismatch',
    field: 'tags vs redemptionTerms',
    check: (fund) => {
      const hasNoLockupTag = fund.tags?.includes('No Lock-Up') || false;
      const hasHoldingPeriod = (fund.redemptionTerms?.minimumHoldingPeriod || 0) > 0;
      return hasNoLockupTag && hasHoldingPeriod;
    },
    patterns: [], // This checks tags against structured data, not text
    getMessage: (fund) => ({
      structuredValue: `${fund.redemptionTerms?.minimumHoldingPeriod} months holding period`,
      message: `Fund has "No Lock-Up" tag but minimum holding period is ${fund.redemptionTerms?.minimumHoldingPeriod} months`,
    }),
    severity: 'warning',
  },
  
  // Daily NAV tag without daily redemption
  {
    id: 'daily-nav-tag',
    field: 'tags vs redemptionTerms',
    check: (fund) => {
      const hasDailyNavTag = fund.tags?.includes('Daily NAV') || false;
      const freq = fund.redemptionTerms?.frequency?.toLowerCase();
      const isDailyRedemption = freq === 'daily' || freq === 'continuous trading';
      return hasDailyNavTag && !isDailyRedemption;
    },
    patterns: [],
    getMessage: (fund) => ({
      structuredValue: fund.redemptionTerms?.frequency || 'Not Daily',
      message: `Fund has "Daily NAV" tag but redemption frequency is ${fund.redemptionTerms?.frequency || 'not specified'}`,
    }),
    severity: 'warning',
  },
];

/**
 * Check a text field for contradictions against structured data
 */
function checkTextForContradictions(
  fund: Fund,
  text: string | undefined,
  location: ContradictionLocation
): Contradiction[] {
  if (!text) return [];
  
  const contradictions: Contradiction[] = [];
  
  for (const rule of contradictionRules) {
    // Skip rules that check tags against structured data (no text patterns)
    if (rule.patterns.length === 0) continue;
    
    // Check if the rule condition applies
    if (!rule.check(fund)) continue;
    
    // Check if any pattern matches the text
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        const { structuredValue, message } = rule.getMessage(fund);
        contradictions.push({
          field: rule.field,
          structuredValue,
          conflictingText: match[0],
          location,
          severity: rule.severity,
          message,
        });
        break; // Only report first match per rule
      }
    }
  }
  
  return contradictions;
}

/**
 * Check for tag vs structured data contradictions
 */
function checkTagContradictions(fund: Fund): Contradiction[] {
  const contradictions: Contradiction[] = [];
  
  for (const rule of contradictionRules) {
    // Only process rules that check tags (no text patterns)
    if (rule.patterns.length > 0) continue;
    
    // Check if the contradiction condition is met
    if (rule.check(fund)) {
      const { structuredValue, message } = rule.getMessage(fund);
      contradictions.push({
        field: rule.field,
        structuredValue,
        conflictingText: 'Tag mismatch',
        location: 'auto-generated',
        severity: rule.severity,
        message,
      });
    }
  }
  
  return contradictions;
}

/**
 * Detect all contradictions in a fund's data
 */
export function detectFundContradictions(fund: Fund): ContradictionResult {
  const contradictions: Contradiction[] = [];
  
  // Check description field
  const descriptionContradictions = checkTextForContradictions(
    fund,
    fund.description,
    'description'
  );
  contradictions.push(...descriptionContradictions);
  
  // Check detailed description field
  const detailedContradictions = checkTextForContradictions(
    fund,
    fund.detailedDescription,
    'detailedDescription'
  );
  contradictions.push(...detailedContradictions);
  
  // Check tag contradictions
  const tagContradictions = checkTagContradictions(fund);
  contradictions.push(...tagContradictions);
  
  const errorCount = contradictions.filter(c => c.severity === 'error').length;
  const warningCount = contradictions.filter(c => c.severity === 'warning').length;
  
  return {
    hasContradictions: contradictions.length > 0,
    errorCount,
    warningCount,
    contradictions,
  };
}

/**
 * Get a summary message for contradictions
 */
export function getContradictionSummary(result: ContradictionResult): string {
  if (!result.hasContradictions) {
    return 'No contradictions detected';
  }
  
  const parts: string[] = [];
  if (result.errorCount > 0) {
    parts.push(`${result.errorCount} error${result.errorCount > 1 ? 's' : ''}`);
  }
  if (result.warningCount > 0) {
    parts.push(`${result.warningCount} warning${result.warningCount > 1 ? 's' : ''}`);
  }
  
  return `Found ${parts.join(' and ')}`;
}
