import React from 'react';
import { TrendingUp, Euro, Clock } from 'lucide-react';
import { calculateCategoryStatistics } from '../../utils/categoryStatistics';
import { getReturnTargetNumbers } from '../../utils/returnTarget';
import { Fund } from '../../data/types/funds';
import { pluralize } from '../../utils/textHelpers';

interface CategorySnapshotHeroProps {
  categoryName: string;
  funds: Fund[];
}

const CategorySnapshotHero: React.FC<CategorySnapshotHeroProps> = ({ categoryName, funds }) => {
  const stats = calculateCategoryStatistics(funds);

  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return 'Not disclosed';
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    return `€${(amount / 1000).toFixed(0)}K`;
  };

  const formatReturn = (rate: number | null): string => {
    if (rate === null) return 'Not disclosed';
    return `${rate.toFixed(1)}% p.a.`;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-8 mb-8">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
          Portugal {categoryName} Funds
        </h1>
        <p className="text-lg text-muted-foreground">
          Aggregated stats for {stats.totalCount} active {pluralize(stats.totalCount, 'fund')}
        </p>
      </div>

      {/* 3 Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Avg Target Return */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Avg. Target Return
            </h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatReturn(stats.avgTargetReturn)}
          </p>
        </div>

        {/* Avg Min Investment */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Euro className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Avg. Min Investment
            </h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(stats.avgMinInvestment)}
          </p>
        </div>

        {/* Typical Lock-up */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Typical Lock-up
            </h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.typicalLockup}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategorySnapshotHero;
