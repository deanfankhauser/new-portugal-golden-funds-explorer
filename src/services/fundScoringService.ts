// Legacy compatibility stub - scoring system has been replaced with recency-based ranking
// This file is kept to prevent breaking imports in fund-index components

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
  // Legacy stub methods - return empty/default values
  // Real ranking is now done via FundRankingService with recency-based logic
  
  static calculateMovingtoScore(fund: Fund): FundScore {
    return {
      fundId: fund.id,
      movingtoScore: 50,
      performanceScore: 50,
      regulatoryScore: 50,
      feeScore: 50,
      protectionScore: 50,
      rank: 999
    };
  }

  static getAllFundScores(funds: Fund[]): FundScore[] {
    return funds.map((fund, index) => ({
      fundId: fund.id,
      movingtoScore: 50,
      performanceScore: 50,
      regulatoryScore: 50,
      feeScore: 50,
      protectionScore: 50,
      rank: index + 1
    }));
  }

  static getTopFunds(funds: Fund[], count: number = 5): FundScore[] {
    return this.getAllFundScores(funds).slice(0, count);
  }
}

// Note: This scoring system is no longer used for actual fund ranking
// Fund ranking is now controlled via the FundRankingService with recency-based logic
// This stub exists only for backwards compatibility with fund-index visualization components

