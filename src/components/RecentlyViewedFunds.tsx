
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { getReturnTargetDisplay } from '../utils/returnTarget';

const RecentlyViewedFunds = () => {
  const { recentlyViewed } = useRecentlyViewed();

  // SSR-safe: Don't render during server-side rendering
  if (typeof window === 'undefined') return null;

  if (recentlyViewed.length === 0) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="border-t border-border pt-8 pb-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          Recently Viewed Funds
        </h3>
      </div>

      {/* Funds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recentlyViewed.map((fund) => (
          <Link
            key={fund.id}
            to={`/${fund.id}`}
            className="group relative bg-card border border-border/60 rounded-xl p-7 hover:border-border hover:shadow-lg transition-all duration-200 overflow-hidden"
            style={{
              willChange: 'transform',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Top border highlight */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-success to-success/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Recent indicator dot */}
            <div className="absolute top-3 right-3 w-2 h-2 bg-success rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-200" />

            {/* Card Header */}
            <div className="flex items-start justify-between mb-5 min-h-[56px]">
              <h4 className="font-semibold text-[18px] text-foreground leading-tight tracking-tight line-clamp-2 max-w-[80%]">
                {fund.name}
              </h4>
              {fund.isVerified && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-md text-[12px] font-medium whitespace-nowrap flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Min Investment</span>
                <span className="text-[15px] font-semibold text-foreground">
                  {formatCurrency(fund.minimumInvestment)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Target Annual Return</span>
                <span className="text-[15px] font-semibold text-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-success" />
                  {getReturnTargetDisplay(fund)}
                </span>
              </div>
            </div>

            {/* Manager */}
            <div className="pt-4 border-t border-border/60">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/80 font-medium mb-1">
                Fund Manager
              </div>
              <div className="text-[14px] text-muted-foreground font-medium">
                {fund.managerName}
              </div>
            </div>

            {/* Hover Footer */}
            <div className="absolute bottom-0 left-0 right-0 h-0 bg-muted/20 flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:h-12">
              <span className="text-[13px] text-muted-foreground font-medium flex items-center gap-1.5">
                View Details
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedFunds;
