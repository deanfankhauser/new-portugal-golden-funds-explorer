import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import FundCard from '@/components/FundCard';
import FundListSkeleton from '@/components/common/FundListSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import type { Fund } from '@/data/types/funds';

// Filter labels for display
const FILTER_LABELS: Record<string, Record<string, string>> = {
  minInvestment: {
    '100-250': '€100K – €250K',
    '250-500': '€250K – €500K',
    '500+': '€500K+',
  },
  risk: {
    low: 'Low risk',
    medium: 'Medium risk',
    high: 'High risk',
  },
  liquidity: {
    '3-6': '3–6 years',
    '6-8': '6–8 years',
    '8-10': '8–10 years',
  },
  verified: {
    true: 'Verified only',
  },
};

// Apply filters to funds
const filterFunds = (funds: Fund[], params: URLSearchParams): Fund[] => {
  return funds.filter((fund) => {
    // Verified filter
    if (params.get('verified') === 'true' && !fund.isVerified) {
      return false;
    }

    // Min investment filter
    const minInv = params.get('minInvestment');
    if (minInv && fund.minimumInvestment !== undefined && fund.minimumInvestment !== null) {
      const investment = fund.minimumInvestment;
      if (minInv === '100-250' && (investment < 100000 || investment > 250000)) return false;
      if (minInv === '250-500' && (investment < 250000 || investment > 500000)) return false;
      if (minInv === '500+' && investment < 500000) return false;
    }

    // Risk filter - check tags for risk level
    const risk = params.get('risk');
    if (risk && fund.tags) {
      const riskTagMap: Record<string, string[]> = {
        low: ['Low-risk', 'low-risk', 'Conservative'],
        medium: ['Medium-risk', 'medium-risk', 'Balanced'],
        high: ['High-risk', 'high-risk', 'Aggressive'],
      };
      const targetTags = riskTagMap[risk] || [];
      const hasRiskTag = fund.tags.some((tag) =>
        targetTags.some((t) => tag.toLowerCase().includes(t.toLowerCase()))
      );
      if (!hasRiskTag) return false;
    }

    // Liquidity/Term filter - check term in years
    const term = params.get('liquidity');
    if (term && fund.term !== undefined && fund.term !== null) {
      const years = fund.term;
      if (term === '3-6' && (years < 3 || years > 6)) return false;
      if (term === '6-8' && (years < 6 || years > 8)) return false;
      if (term === '8-10' && (years < 8 || years > 10)) return false;
    }

    // Category filter
    const category = params.get('category');
    if (category && fund.category !== category) {
      return false;
    }

    return true;
  });
};

const FundsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { funds, loading, error } = useRealTimeFunds();

  // Get active filters
  const activeFilters: { key: string; value: string; label: string }[] = [];
  
  ['verified', 'minInvestment', 'risk', 'liquidity', 'category'].forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      const label = FILTER_LABELS[key]?.[value] || value;
      activeFilters.push({ key, value, label });
    }
  });

  // Remove a filter
  const removeFilter = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams, { replace: true });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
  };

  // Filter funds based on URL params
  const filteredFunds = funds ? filterFunds(funds, searchParams) : [];

  // Sort: verified first, then by rank
  const sortedFunds = [...filteredFunds].sort((a, b) => {
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return (a.finalRank ?? 999) - (b.finalRank ?? 999);
  });

  const hasFilters = activeFilters.length > 0;

  return (
    <>
      <PageSEO pageType="homepage" />
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="border-b border-border/40 bg-muted/20">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Funds</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {hasFilters ? 'Filtered Funds' : 'All Funds'}
            </h1>
            <p className="text-muted-foreground">
              {loading ? (
                'Loading funds...'
              ) : (
                <>
                  Showing <span className="font-semibold text-foreground">{sortedFunds.length}</span> fund{sortedFunds.length !== 1 ? 's' : ''}
                  {hasFilters && ' matching your criteria'}
                </>
              )}
            </p>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {activeFilters.map(({ key, label }) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="pl-3 pr-2 py-1.5 flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20"
                >
                  {label}
                  <button
                    onClick={() => removeFilter(key)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${label} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <FundListSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error loading funds. Please try again.</p>
              <Button onClick={() => window.location.reload()}>Reload</Button>
            </div>
          ) : sortedFunds.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-border/40">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No funds match your filters</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your filter criteria or browse all available funds.
              </p>
              <Button onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFunds.map((fund) => (
                <FundCard key={fund.id} fund={fund} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FundsPage;
