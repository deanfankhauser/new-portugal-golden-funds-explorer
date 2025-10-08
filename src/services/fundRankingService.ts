import { Fund } from '../data/types/funds';
import { FundScoringService } from './fundScoringService';

export interface FundRankingData {
  id?: string;
  fund_id: string;
  manual_rank: number | null;
  category_rank: number | null;
  visibility_boost: number;
  notes: string | null;
  last_modified_by?: string | null;
  created_at?: string;
  updated_at?: string;
  algo_rank: number | null;
  final_rank: number;
}

export class FundRankingService {
  /**
   * Calculate final rank for a fund
   * Priority: manual_rank > algo_rank > 999 (unranked)
   */
  static calculateFinalRank(
    manual_rank: number | null,
    algo_rank: number | null
  ): number {
    if (manual_rank !== null && manual_rank > 0) return manual_rank;
    if (algo_rank !== null && algo_rank > 0) return algo_rank;
    return 999; // Unranked - bottom of list
  }

  /**
   * Get algorithm-suggested rank for a fund
   */
  static getAlgorithmRank(fund: Fund, allFunds: Fund[]): number {
    const scores = FundScoringService.getAllFundScores(allFunds);
    const fundScore = scores.find(s => s.fundId === fund.id);
    return fundScore?.rank || 999;
  }

  /**
   * Enrich funds with ranking data
   */
  static enrichFundsWithRankings(
    funds: Fund[],
    rankings: FundRankingData[]
  ): (Fund & { rankingData: FundRankingData })[] {
    const rankingMap = new Map(rankings.map(r => [r.fund_id, r]));
    
    return funds.map(fund => {
      const existingRanking = rankingMap.get(fund.id);
      const algo_rank = this.getAlgorithmRank(fund, funds);
      
      const ranking: FundRankingData = existingRanking ? {
        ...existingRanking,
        algo_rank,
        final_rank: this.calculateFinalRank(existingRanking.manual_rank, algo_rank)
      } : {
        fund_id: fund.id,
        manual_rank: null,
        category_rank: null,
        visibility_boost: 0,
        notes: null,
        algo_rank,
        final_rank: algo_rank
      };
      
      return {
        ...fund,
        rankingData: ranking
      };
    });
  }

  /**
   * Sort funds by final rank
   */
  static sortByRank<T extends { rankingData: FundRankingData }>(funds: T[]): T[] {
    return [...funds].sort((a, b) => a.rankingData.final_rank - b.rankingData.final_rank);
  }

  /**
   * Get top N ranked funds
   */
  static getTopFunds<T extends { rankingData: FundRankingData }>(
    funds: T[],
    count: number
  ): T[] {
    return this.sortByRank(funds).slice(0, count);
  }

  /**
   * Calculate deviation between manual and algorithm rank
   */
  static getRankDeviation(manual_rank: number | null, algo_rank: number | null): {
    deviation: number;
    severity: 'none' | 'low' | 'medium' | 'high';
  } {
    if (manual_rank === null || algo_rank === null) {
      return { deviation: 0, severity: 'none' };
    }

    const deviation = Math.abs(manual_rank - algo_rank);
    
    let severity: 'none' | 'low' | 'medium' | 'high' = 'none';
    if (deviation === 0) severity = 'none';
    else if (deviation <= 3) severity = 'low';
    else if (deviation <= 10) severity = 'medium';
    else severity = 'high';

    return { deviation, severity };
  }
}
