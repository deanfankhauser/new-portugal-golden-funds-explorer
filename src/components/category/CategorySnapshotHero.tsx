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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avg Target Return */}
        <div className="bg-background rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Avg. Target Return</h3>
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatReturn(stats.avgTargetReturn)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Based on {funds.filter(f => {
              const { min, max } = getReturnTargetNumbers(f);
              return min != null || max != null;
            }).length} funds with disclosed returns
          </p>
        </div>

        {/* Avg Min Investment */}
        <div className="bg-background rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Euro className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-foreground">Avg. Min Investment</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(stats.avgMinInvestment)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.gvEligibleCount} Golden Visa eligible
          </p>
        </div>

        {/* Typical Lock-up */}
        <div className="bg-background rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-foreground">Typical Lock-up</h3>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {stats.typicalLockup}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Most common period across funds
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategorySnapshotHero;
