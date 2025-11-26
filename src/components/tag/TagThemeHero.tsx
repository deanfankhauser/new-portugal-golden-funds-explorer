import React from 'react';
import { Fund } from '../../data/types/funds';
import { calculateTagStatistics } from '../../utils/tagStatistics';
import { TrendingUp, Clock, BadgeCheck } from 'lucide-react';

interface TagThemeHeroProps {
  tagName: string;
  funds: Fund[];
}

const TagThemeHero: React.FC<TagThemeHeroProps> = ({ tagName, funds }) => {
  const stats = calculateTagStatistics(funds);

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Portugal {tagName} Investment Funds
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse {stats.totalCount} fund{stats.totalCount !== 1 ? 's' : ''} specializing in {tagName} eligible for the Golden Visa.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Target Yield */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Avg. Target Yield
            </h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.avgTargetYield !== null 
              ? `${stats.avgTargetYield.toFixed(1)}% p.a.`
              : 'Not disclosed'}
          </p>
        </div>

        {/* Average Lock-up Period */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Avg. Lock-up Period
            </h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.avgLockupPeriod !== null 
              ? `${Math.round(stats.avgLockupPeriod)} months`
              : 'Varies'}
          </p>
        </div>

        {/* GV Eligible Count */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              GV Eligible
            </h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.gvEligibleCount} of {stats.totalCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TagThemeHero;
