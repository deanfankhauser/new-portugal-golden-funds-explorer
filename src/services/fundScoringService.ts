
import { Fund } from '../data/types/funds';

export interface FundScore {
  fundId: string;
  movingtoScore: number;
  performanceScore: number;
  regulatoryScore: number;
  feeScore: number;
  protectionScore: number;
  rank: number;
}

export class FundScoringService {
  // Calculate performance score based on return target and fund performance
  static calculatePerformanceScore(fund: Fund): number {
    const returnTarget = fund.returnTarget.toLowerCase();
    
    // Extract percentage from return target
    let targetReturn = 0;
    if (returnTarget.includes('12%')) targetReturn = 12;
    else if (returnTarget.includes('10%')) targetReturn = 10;
    else if (returnTarget.includes('8%')) targetReturn = 8;
    else if (returnTarget.includes('6%')) targetReturn = 6;
    else if (returnTarget.includes('5%')) targetReturn = 5;
    else if (returnTarget.includes('4%')) targetReturn = 4;
    else targetReturn = 5; // default
    
    // Score based on target return (higher = better)
    let score = Math.min(targetReturn * 8, 100);
    
    // Adjust for fund status
    if (fund.fundStatus === 'Open') score += 10;
    else if (fund.fundStatus === 'Closing Soon') score += 5;
    
    return Math.min(score, 100);
  }

  // Calculate regulatory score based on regulation and compliance
  static calculateRegulatoryScore(fund: Fund): number {
    let score = 50; // base score
    
    // Higher score for better regulation
    if (fund.regulatedBy.includes('CMVM')) score += 25;
    if (fund.regulatedBy.includes('Bank of Portugal')) score += 20;
    if (fund.regulatedBy.includes('EU')) score += 15;
    
    // Bonus for compliance tags
    if (fund.tags.includes('UCITS')) score += 15;
    if (fund.tags.includes('PFIC-Compliant')) score += 10;
    if (fund.tags.includes('QEF Eligible')) score += 10;
    if (fund.tags.includes('Regulated')) score += 10;
    
    return Math.min(score, 100);
  }

  // Calculate fee score (lower fees = higher score)
  static calculateFeeScore(fund: Fund): number {
    const managementFee = fund.managementFee;
    const performanceFee = fund.performanceFee;
    const totalFees = managementFee + (performanceFee * 0.5); // Weight performance fee less
    
    // Inverse scoring - lower fees get higher scores
    let score = 100 - (totalFees * 20);
    
    // Bonus for no fees
    if (fund.tags.includes('No Fees')) score = 100;
    if (managementFee === 0) score += 20;
    
    return Math.max(Math.min(score, 100), 0);
  }

  // Calculate investor protection score
  static calculateProtectionScore(fund: Fund): number {
    let score = 30; // base score
    
    // Higher score for better protections
    if (fund.tags.includes('Capital Preservation')) score += 25;
    if (fund.tags.includes('Daily NAV')) score += 15;
    if (fund.tags.includes('No Lock-Up')) score += 15;
    if (fund.tags.includes('Liquid')) score += 15;
    if (fund.redemptionTerms?.redemptionOpen) score += 10;
    
    // Fund size stability bonus
    if (fund.fundSize > 100) score += 10;
    if (fund.fundSize > 50) score += 5;
    
    // Established manager bonus
    const yearsEstablished = new Date().getFullYear() - fund.established;
    if (yearsEstablished > 10) score += 10;
    else if (yearsEstablished > 5) score += 5;
    
    return Math.min(score, 100);
  }

  // Calculate overall Movingto Score
  static calculateMovingtoScore(fund: Fund): FundScore {
    const performanceScore = this.calculatePerformanceScore(fund);
    const regulatoryScore = this.calculateRegulatoryScore(fund);
    const feeScore = this.calculateFeeScore(fund);
    const protectionScore = this.calculateProtectionScore(fund);
    
    // Weighted average: Performance 40%, Regulatory 25%, Fees 20%, Protection 15%
    const movingtoScore = Math.round(
      (performanceScore * 0.4) +
      (regulatoryScore * 0.25) +
      (feeScore * 0.2) +
      (protectionScore * 0.15)
    );
    
    return {
      fundId: fund.id,
      movingtoScore,
      performanceScore: Math.round(performanceScore),
      regulatoryScore: Math.round(regulatoryScore),
      feeScore: Math.round(feeScore),
      protectionScore: Math.round(protectionScore),
      rank: 0 // Will be set after sorting
    };
  }

  // Get all fund scores sorted by Movingto Score
  static getAllFundScores(funds: Fund[]): FundScore[] {
    const scores = funds.map(fund => this.calculateMovingtoScore(fund));
    
    // Sort by score descending and assign ranks
    scores.sort((a, b) => b.movingtoScore - a.movingtoScore);
    scores.forEach((score, index) => {
      score.rank = index + 1;
    });
    
    return scores;
  }

  // Get top N funds by score
  static getTopFunds(funds: Fund[], count: number = 5): FundScore[] {
    return this.getAllFundScores(funds).slice(0, count);
  }
}
