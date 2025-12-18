import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';
import { normalizeComparisonSlug } from '../../utils/comparisonUtils';
import { URL_CONFIG } from '../../utils/urlConfig';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRealTimeFunds } from '../../hooks/useRealTimeFunds';
import { CompanyLogo } from '../shared/CompanyLogo';

interface FundComparisonSuggestionsProps {
  currentFund: Fund;
  initialFunds?: Fund[]; // For SSR internal linking
}

const FundComparisonSuggestions: React.FC<FundComparisonSuggestionsProps> = ({ currentFund, initialFunds }) => {
  const { funds: queryFunds = [], loading: isLoading } = useRealTimeFunds();
  
  // Use initialFunds during SSR, queryFunds for client-side
  const funds = initialFunds && initialFunds.length > 0 ? initialFunds : queryFunds;

  // Find similar funds based on category and size
  const suggestedFunds = funds
    .filter(fund => 
      fund.id !== currentFund.id && 
      (fund.category === currentFund.category || 
       Math.abs((fund.minimumInvestment || 0) - (currentFund.minimumInvestment || 0)) < 100000)
    )
    .slice(0, 3);

  // During SSR with initialFunds, skip loading check
  if (!initialFunds && isLoading) return null;
  if (suggestedFunds.length === 0) return null;

  return (
    <div className="mt-12 bg-card rounded-2xl border border-border/40 shadow-sm p-6 lg:p-10">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl md:text-[28px] font-bold tracking-tight text-foreground font-heading mb-4">
          Compare {currentFund.name}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Compare {currentFund.name} with similar investment funds to analyze performance, fees, and investment requirements.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-3 md:space-y-4">
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
                <div className="flex items-start justify-between gap-3">
                  {/* Left Side - Fund Names */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      {/* Base Fund */}
                      <div className="flex items-center gap-2 min-w-0">
                        <CompanyLogo managerName={currentFund.managerName} size="sm" />
                        <span className="font-semibold text-sm sm:text-base text-foreground break-words">
                          {currentFund.name}
                        </span>
                        {currentFund.isVerified && (
                          <Link to="/verification-program" onClick={(e) => e.stopPropagation()} className="hover:opacity-80 transition-opacity">
                            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                          </Link>
                        )}
                      </div>

                      {/* VS Divider */}
                      <span className="text-xs font-medium uppercase tracking-wider shrink-0 hidden sm:inline text-muted-foreground">
                        vs
                      </span>

                      {/* Compare Fund */}
                      <div className="flex items-center gap-2 min-w-0">
                        <CompanyLogo managerName={fund.managerName} size="sm" />
                        <span className="font-medium text-sm sm:text-base text-foreground break-words min-w-0">
                          {fund.name}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm">
                      <span className="text-muted-foreground">
                        {fund.category}
                      </span>
                      <span className="text-border">•</span>
                      <span className="font-medium text-accent">
                        Min. {fund.minimumInvestment > 0 ? `€${fund.minimumInvestment.toLocaleString()}` : 'Not provided'}
                      </span>
                    </div>
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow transition-all duration-200 hover:translate-y-[-1px] h-12"
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