import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  2026 Fund Shortlist
                </h2>
              </div>
              <p className="text-muted-foreground">
                Ranked by disclosed fees, liquidity terms, and governance signals
              </p>
            </div>
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
            <Button asChild size="lg">
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

  return (
    <Link to={`/funds/${fund.id}`}>
      <Card className="h-full hover:border-primary/30 hover:shadow-md transition-all duration-200 group">
        <CardContent className="p-4">
          {/* Rank Badge */}
          <div className="flex items-start justify-between mb-3">
            <Badge 
              variant="outline" 
              className="text-xs font-mono bg-primary/5 text-primary border-primary/20"
            >
              #{rank}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              {Math.round(score)}/100
            </span>
          </div>

          {/* Fund Name */}
          <h3 className="font-semibold text-foreground text-sm leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {fund.name}
          </h3>

          {/* Category */}
          <p className="text-xs text-muted-foreground mb-3">
            {fund.category || 'Investment Fund'}
          </p>

          {/* Key Metrics */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mgmt Fee</span>
              <span className="font-mono text-foreground">{formatFee(fund.managementFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lock-up</span>
              <span className="font-mono text-foreground">
                {fund.term ? `${fund.term}y` : '—'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BestShortlistPreview;
