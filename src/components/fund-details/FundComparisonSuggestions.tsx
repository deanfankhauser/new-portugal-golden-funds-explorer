import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';
import { funds } from '../../data/funds';
import { normalizeComparisonSlug } from '../../utils/comparisonUtils';
import { URL_CONFIG } from '../../utils/urlConfig';
import { ArrowLeftRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FundComparisonSuggestionsProps {
  currentFund: Fund;
}

const FundComparisonSuggestions: React.FC<FundComparisonSuggestionsProps> = ({ currentFund }) => {
  // Find similar funds based on category and size
  const suggestedFunds = funds
    .filter(fund => 
      fund.id !== currentFund.id && 
      (fund.category === currentFund.category || 
       Math.abs((fund.minimumInvestment || 0) - (currentFund.minimumInvestment || 0)) < 100000)
    )
    .slice(0, 3);

  if (suggestedFunds.length === 0) return null;

  return (
    <div className="mt-12 bg-background rounded-2xl border border-border/40 shadow-sm p-10">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <ArrowLeftRight className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
          </div>
          <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground font-heading">
            Compare {currentFund.name}
          </h2>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">
          Compare {currentFund.name} with similar investment funds to analyze performance, fees, and investment requirements.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-3">
        {suggestedFunds.map((fund) => {
          const comparisonSlug = normalizeComparisonSlug(`${currentFund.id}-vs-${fund.id}`);
          const comparisonUrl = URL_CONFIG.buildUrl(`compare/${comparisonSlug}`);
          
          return (
            <Link
              key={fund.id}
              to={comparisonUrl}
              className="group relative block rounded-xl transition-all duration-200 hover:shadow-lg bg-card border border-border/40 hover:border-primary/20"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  {/* Left Side - Fund Names */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Base Fund */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-sm sm:text-base whitespace-nowrap text-foreground">
                        {currentFund.name}
                      </span>
                      {currentFund.isVerified && (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      )}
                    </div>

                    {/* Verified Badge */}
                    {currentFund.isVerified && currentFund.verifiedAt && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 bg-success text-white">
                        <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                        <span>Recently Verified</span>
                      </div>
                    )}

                    {/* VS Divider */}
                    <span className="text-xs font-medium uppercase tracking-wider shrink-0 hidden sm:inline text-muted-foreground">
                      vs
                    </span>

                    {/* Compare Fund */}
                    <span className="font-medium text-sm sm:text-base truncate text-foreground">
                      {fund.name}
                    </span>
                  </div>

                  {/* Right Side - Swap Button */}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-sm border border-border bg-card text-muted-foreground hover:text-foreground"
                    aria-label="View comparison"
                  >
                    <ArrowLeftRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 mt-3 text-sm">
                  <span className="inline-flex items-center text-muted-foreground">
                    {fund.category}
                  </span>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center font-medium text-accent">
                    Min. {fund.minimumInvestment > 0 ? `€${fund.minimumInvestment.toLocaleString()}` : 'Not provided'}
                  </span>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-primary/20" />
            </Link>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-6 text-center">
        <Link to="/compare">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow transition-all duration-200 hover:translate-y-[-1px]"
          >
            <span>View All Comparisons</span>
            <ArrowLeftRight className="h-4 w-4 ml-2" strokeWidth={2} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FundComparisonSuggestions;