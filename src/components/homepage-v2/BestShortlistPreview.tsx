import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSortedBestFunds, ScoredFund } from '@/utils/fundScoring';
import DataFreshnessBadge from '@/components/common/DataFreshnessBadge';
import type { Fund } from '@/data/types/funds';

interface BestShortlistPreviewProps {
  funds: Fund[];
}

const BestShortlistPreview: React.FC<BestShortlistPreviewProps> = ({ funds }) => {
  const topFunds = getSortedBestFunds(funds, 4);

  if (topFunds.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                2026 Fund Shortlist
              </h2>
            </div>
            <p className="text-muted-foreground mb-3">
              Ranked by disclosed fees, liquidity terms, and governance signals
            </p>
            <DataFreshnessBadge variant="inline" />
          </div>

          {/* Fund Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {topFunds.map((scoredFund, index) => (
              <CompactFundCard 
                key={scoredFund.fund.id} 
                scoredFund={scoredFund} 
                rank={index + 1} 
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="shadow-sm hover:shadow-md transition-shadow">
              <Link to="/best-portugal-golden-visa-funds">
                View Full Shortlist
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface CompactFundCardProps {
  scoredFund: ScoredFund;
  rank: number;
}

const CompactFundCard: React.FC<CompactFundCardProps> = ({ scoredFund, rank }) => {
  const { fund, score } = scoredFund;
  
  const formatFee = (fee: number | null | undefined): string => {
    if (fee === null || fee === undefined) return '—';
    return `${fee}%`;
  };

  const scorePercent = Math.round(score);

  return (
    <Link to={`/funds/${fund.id}`}>
      <div className="h-full bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-200 group flex flex-col min-h-[220px]">
        {/* Header: Rank + Category */}
        <div className="flex items-center justify-between mb-3">
          <Badge className="text-xs font-semibold bg-primary text-primary-foreground border-0">
            #{rank}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {fund.category || 'Fund'}
          </span>
        </div>

        {/* Fund Name */}
        <h3 className="font-semibold text-foreground text-sm leading-tight mb-auto line-clamp-2 group-hover:text-primary transition-colors">
          {fund.name}
        </h3>

        {/* Key Metrics */}
        <div className="space-y-2 text-xs mt-4 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mgmt Fee</span>
            <span className="font-medium text-foreground">{formatFee(fund.managementFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lock-up</span>
            <span className="font-medium text-foreground">
              {fund.term ? `${fund.term}y` : '—'}
            </span>
          </div>
        </div>

        {/* Score Bar */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Score</span>
            <span className="text-xs font-semibold text-foreground">{scorePercent}/100</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BestShortlistPreview;
