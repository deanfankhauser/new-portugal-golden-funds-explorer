import { Fund } from '../data/types/funds';

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
  recency_rank: number | null;
  final_rank: number;
}

export class FundRankingService {
  /**
   * Calculate final rank for a fund
   * Priority: manual_rank > recency_rank > 999 (unranked)
   */
  static calculateFinalRank(
    manual_rank: number | null,
    recency_rank: number | null
  ): number {
    if (manual_rank !== null && manual_rank > 0) return manual_rank;
    if (recency_rank !== null && recency_rank > 0) return recency_rank;
    return 999; // Unranked - bottom of list
  }

  /**
   * Calculate recency-based rank for funds without manual rank
   * More recently updated funds get better (lower) ranks
   */
  static calculateRecencyRanks(funds: Fund[]): Map<string, number> {
    const recencyMap = new Map<string, number>();
    
    // Sort funds by updated_at descending (most recent first)
    const sortedByRecency = [...funds].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA; // Descending order
    });
    
    // Assign sequential ranks starting from 1000 to keep them below manual ranks
    sortedByRecency.forEach((fund, index) => {
      recencyMap.set(fund.id, 1000 + index);
    });
    
    return recencyMap;
  }

  /**
   * Enrich funds with ranking data
   */
  static enrichFundsWithRankings(
    funds: Fund[],
    rankings: FundRankingData[]
  ): (Fund & { rankingData: FundRankingData })[] {
    const rankingMap = new Map(rankings.map(r => [r.fund_id, r]));
    const recencyRanks = this.calculateRecencyRanks(funds);
    
    return funds.map(fund => {
      const existingRanking = rankingMap.get(fund.id);
      const recency_rank = recencyRanks.get(fund.id) || 999;
      
      const ranking: FundRankingData = existingRanking ? {
        ...existingRanking,
        recency_rank,
        final_rank: this.calculateFinalRank(existingRanking.manual_rank, recency_rank)
      } : {
        fund_id: fund.id,
        manual_rank: null,
        category_rank: null,
        visibility_boost: 0,
        notes: null,
        recency_rank,
        final_rank: recency_rank
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
}
