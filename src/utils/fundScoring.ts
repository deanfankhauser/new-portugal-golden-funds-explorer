/**
 * Fund Scoring Utility
 * 
 * Implements a weighted scoring system for ranking funds based on:
 * - Total Fees (35%): Lower combined fees = higher score
 * - Liquidity Terms (35%): Shorter lock-up + better redemption = higher score
 * - Governance Signals (20%): More disclosed info = higher score
 * - Minimum Investment (10%): Lower minimum = higher score
 */

import { Fund } from '@/data/types/funds';

export interface ScoreBreakdown {
  feeScore: number;
  liquidityScore: number;
  governanceScore: number;
  minimumScore: number;
}

export interface ScoredFund {
  fund: Fund;
  score: number;
  isComplete: boolean;
  breakdown: ScoreBreakdown;
  whyIncluded: string;
}

export interface FundCluster {
  id: string;
  title: string;
  description: string;
  funds: ScoredFund[];
}

// Weights for scoring
const WEIGHTS = {
  fees: 0.35,
  liquidity: 0.35,
  governance: 0.20,
  minimum: 0.10
};

// Max values for normalization
const MAX_COMBINED_FEE = 5; // 5% combined fee is the max
const MAX_LOCKUP_YEARS = 10; // 10 years is max lock-up
const STANDARD_MINIMUM = 500000; // €500k is the standard GV minimum

/**
 * Calculate fee score (0-100)
 * Lower fees = higher score
 */
function calculateFeeScore(fund: Fund): number {
  const managementFee = fund.managementFee ?? null;
  const performanceFee = fund.performanceFee ?? null;
  
  // If no fee data, return middle score
  if (managementFee === null && performanceFee === null) {
    return 50;
  }
  
  // Combined fee calculation
  const mgmtFee = managementFee ?? 0;
  // Performance fee is typically on profits, so we weight it lower (assume 50% hit)
  const effectivePerfFee = ((performanceFee ?? 0) / 100) * 50; // e.g., 20% perf fee = 10% effective
  const combinedFee = mgmtFee + (effectivePerfFee / 10); // Scale down perf fee impact
  
  // Score: lower fee = higher score
  const score = Math.max(0, 100 - (combinedFee / MAX_COMBINED_FEE) * 100);
  return Math.min(100, score);
}

/**
 * Calculate liquidity score (0-100)
 * Shorter lock-up + better redemption = higher score
 */
function calculateLiquidityScore(fund: Fund): number {
  let score = 50; // Default middle score
  
  // Lock-up period scoring (0-60 points) - use term (in years)
  const termYears = fund.term ?? null;
  if (termYears !== null) {
    // 0 years = 60 points, 10+ years = 0 points
    score = Math.max(0, 60 - (termYears / MAX_LOCKUP_YEARS) * 60);
  }
  
  // Redemption frequency scoring (0-40 points)
  const frequency = fund.redemptionTerms?.frequency?.toLowerCase() ?? '';
  if (frequency.includes('daily')) {
    score += 40;
  } else if (frequency.includes('weekly')) {
    score += 35;
  } else if (frequency.includes('monthly')) {
    score += 30;
  } else if (frequency.includes('quarterly')) {
    score += 20;
  } else if (frequency.includes('annual') || frequency.includes('yearly')) {
    score += 10;
  } else if (frequency.includes('end of term') || frequency === '') {
    score += 0;
  } else {
    score += 15; // Unknown frequency
  }
  
  return Math.min(100, score);
}

/**
 * Calculate governance score (0-100)
 * More disclosed information = higher score
 */
function calculateGovernanceScore(fund: Fund): number {
  let points = 0;
  const maxPoints = 10;
  
  // CMVM ID (2 points)
  if (fund.cmvmId) points += 2;
  
  // Auditor disclosed (1.5 points)
  if (fund.auditor) points += 1.5;
  
  // Custodian disclosed (1.5 points)
  if (fund.custodian) points += 1.5;
  
  // NAV frequency disclosed (1 point)
  if (fund.navFrequency) points += 1;
  
  // ISIN available (1 point)
  if (fund.isin) points += 1;
  
  // Detailed description (1 point)
  if (fund.detailedDescription && fund.detailedDescription.length > 200) points += 1;
  
  // FAQs available (0.5 points)
  if (fund.faqs && fund.faqs.length > 0) points += 0.5;
  
  // PDF documents available (0.5 points)
  if (fund.documents && fund.documents.length > 0) points += 0.5;
  
  // Website available (0.5 points)
  if (fund.websiteUrl) points += 0.5;
  
  return (points / maxPoints) * 100;
}

/**
 * Calculate minimum investment score (0-100)
 * Lower minimum = higher score (within GV thresholds)
 */
function calculateMinimumScore(fund: Fund): number {
  const minimum = fund.minimumInvestment ?? null;
  
  if (minimum === null) {
    return 50; // Default middle score
  }
  
  // Score based on how much above €500k minimum
  if (minimum <= STANDARD_MINIMUM) {
    return 100; // At or below standard = max score
  }
  
  // Score decreases as minimum increases above €500k
  const overage = minimum - STANDARD_MINIMUM;
  const penaltyPer100k = 10; // Lose 10 points per €100k over
  const penalty = (overage / 100000) * penaltyPer100k;
  
  return Math.max(0, 100 - penalty);
}

/**
 * Check if fund has enough data to be included in shortlist
 */
function checkDataCompleteness(fund: Fund): boolean {
  let missingCoreFields = 0;
  
  if (fund.managementFee === null || fund.managementFee === undefined) missingCoreFields++;
  if (fund.minimumInvestment === null || fund.minimumInvestment === undefined) missingCoreFields++;
  if (!fund.category) missingCoreFields++;
  if (!fund.description) missingCoreFields++;
  
  // Allow funds with at most 1 missing core field
  return missingCoreFields <= 1;
}

/**
 * Generate "Why it's here" text based on fund characteristics
 */
function generateWhyIncluded(fund: Fund, breakdown: ScoreBreakdown): string {
  const reasons: string[] = [];
  
  // Check for standout characteristics
  if (breakdown.feeScore >= 80) {
    reasons.push('Competitive fee structure');
  }
  
  if (breakdown.liquidityScore >= 80) {
    reasons.push('Flexible liquidity terms');
  }
  
  if (breakdown.governanceScore >= 80) {
    reasons.push('Strong governance disclosure');
  }
  
  if (fund.isVerified) {
    reasons.push('Verified fund');
  }
  
  if (fund.cmvmId) {
    reasons.push('CMVM regulated');
  }
  
  // Category-specific reasons
  if (fund.category?.toLowerCase().includes('debt')) {
    reasons.push('Income-focused strategy');
  }
  
  if (fund.category?.toLowerCase().includes('venture')) {
    reasons.push('Growth-oriented exposure');
  }
  
  // If no specific reasons, use generic based on score
  if (reasons.length === 0) {
    if (breakdown.feeScore + breakdown.liquidityScore > 140) {
      reasons.push('Balanced fee and liquidity profile');
    } else {
      reasons.push('Strong overall profile');
    }
  }
  
  return reasons.slice(0, 2).join('. ') + '.';
}

/**
 * Calculate overall fund score
 */
export function calculateFundScore(fund: Fund): ScoredFund {
  const feeScore = calculateFeeScore(fund);
  const liquidityScore = calculateLiquidityScore(fund);
  const governanceScore = calculateGovernanceScore(fund);
  const minimumScore = calculateMinimumScore(fund);
  
  const breakdown: ScoreBreakdown = {
    feeScore,
    liquidityScore,
    governanceScore,
    minimumScore
  };
  
  const score = 
    (feeScore * WEIGHTS.fees) +
    (liquidityScore * WEIGHTS.liquidity) +
    (governanceScore * WEIGHTS.governance) +
    (minimumScore * WEIGHTS.minimum);
  
  const isComplete = checkDataCompleteness(fund);
  const whyIncluded = generateWhyIncluded(fund, breakdown);
  
  return {
    fund,
    score: Math.round(score * 10) / 10,
    isComplete,
    breakdown,
    whyIncluded
  };
}

/**
 * Get sorted list of best funds
 */
export function getSortedBestFunds(funds: Fund[], limit: number = 8): ScoredFund[] {
  return funds
    .filter(fund => fund.tags?.includes('Golden Visa Eligible') || true) // Include all funds (most are GV eligible)
    .map(calculateFundScore)
    .filter(sf => sf.isComplete) // Only complete data funds
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get best funds grouped by priority category
 */
export function getBestFundsByCategory(funds: Fund[]): FundCluster[] {
  const eligibleFunds = funds; // All funds in the directory are GV-eligible
  const scoredFunds = eligibleFunds.map(calculateFundScore);
  
  const clusters: FundCluster[] = [
    {
      id: 'lowest-fees',
      title: 'Lowest Disclosed Ongoing Fees',
      description: 'Funds with the most competitive combined management and performance fee structures.',
      funds: scoredFunds
        .filter(sf => sf.isComplete && sf.fund.managementFee !== null)
        .sort((a, b) => b.breakdown.feeScore - a.breakdown.feeScore)
        .slice(0, 6)
        .map(sf => ({
          ...sf,
          whyIncluded: `Management fee: ${sf.fund.managementFee ?? 'N/A'}%. ${sf.fund.performanceFee ? `Performance fee: ${sf.fund.performanceFee}%.` : 'No performance fee.'}`
        }))
    },
    {
      id: 'flexible-liquidity',
      title: 'Most Flexible Liquidity Terms',
      description: 'Funds with shorter lock-up periods and more frequent redemption options.',
      funds: scoredFunds
        .filter(sf => sf.isComplete)
        .sort((a, b) => b.breakdown.liquidityScore - a.breakdown.liquidityScore)
        .slice(0, 6)
        .map(sf => ({
          ...sf,
          whyIncluded: sf.fund.term
            ? `${sf.fund.term}-year term. ${sf.fund.redemptionTerms?.frequency || 'End of term'} redemption.`
            : `${sf.fund.redemptionTerms?.frequency || 'Flexible'} redemption terms.`
        }))
    },
    {
      id: 'capital-preservation',
      title: 'Capital Preservation Focus',
      description: 'Debt and infrastructure funds typically focused on income generation and capital protection.',
      funds: scoredFunds
        .filter(sf => 
          sf.isComplete && 
          (sf.fund.category?.toLowerCase().includes('debt') || 
           sf.fund.category?.toLowerCase().includes('infrastructure') ||
           sf.fund.riskBand?.toLowerCase() === 'conservative')
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(sf => ({
          ...sf,
          whyIncluded: `${sf.fund.category} strategy. ${sf.fund.riskBand ? `${sf.fund.riskBand} risk profile.` : ''}`
        }))
    },
    {
      id: 'growth-exposure',
      title: 'Growth & Venture Exposure',
      description: 'Venture capital and private equity funds targeting higher returns through equity investments.',
      funds: scoredFunds
        .filter(sf => 
          sf.isComplete && 
          (sf.fund.category?.toLowerCase().includes('venture') || 
           sf.fund.category?.toLowerCase().includes('private equity') ||
           sf.fund.category?.toLowerCase().includes('equity'))
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(sf => ({
          ...sf,
          whyIncluded: `${sf.fund.category} strategy. Targets long-term capital appreciation.`
        }))
    },
    {
      id: 'high-transparency',
      title: 'Higher Transparency',
      description: 'Funds with comprehensive governance disclosure including auditor, custodian, and regulatory details.',
      funds: scoredFunds
        .filter(sf => sf.isComplete)
        .sort((a, b) => b.breakdown.governanceScore - a.breakdown.governanceScore)
        .slice(0, 6)
        .map(sf => {
          const signals: string[] = [];
          if (sf.fund.cmvmId) signals.push('CMVM regulated');
          if (sf.fund.auditor) signals.push('auditor disclosed');
          if (sf.fund.custodian) signals.push('custodian disclosed');
          return {
            ...sf,
            whyIncluded: signals.length > 0 ? signals.join(', ').charAt(0).toUpperCase() + signals.join(', ').slice(1) + '.' : 'Comprehensive disclosure.'
          };
        })
    }
  ];
  
  // Filter out empty clusters
  return clusters.filter(c => c.funds.length >= 2);
}

/**
 * Format score for display
 */
export function formatScoreDisplay(score: number): string {
  return `${Math.round(score)}/100`;
}
