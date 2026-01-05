import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Flag, List, GitCompare, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { Fund } from '@/data/types/funds';
import { getUSCitizensFundsSeo } from '@/lib/seo/pages/us-citizens-funds';
import { USDefinitionBlock } from '@/components/us-funds/USDefinitionBlock';
import { USFrictionPoints } from '@/components/us-funds/USFrictionPoints';
import { USTaxTopics } from '@/components/us-funds/USTaxTopics';
import { USFundsFAQ } from '@/components/us-funds/USFundsFAQ';
import { USFundCard } from '@/components/us-funds/USFundCard';
import { USFundsFilters, USFundsFilterState } from '@/components/us-funds/USFundsFilters';
import { USEligibilityStatus } from '@/components/us-funds/USEligibilityBadge';
import { PageLoader } from '@/components/common/LoadingSkeleton';

// Simple breadcrumbs component for this page
const USFundsBreadcrumbs: React.FC = () => (
  <nav aria-label="breadcrumbs" className="mb-6">
    <ol className="flex items-center text-sm text-muted-foreground">
      <li>
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
      </li>
      <ChevronRight className="h-4 w-4 mx-2" />
      <li className="text-foreground font-medium">US Citizens</li>
    </ol>
  </nav>
);

interface USCitizensFundsPageProps {
  initialFunds?: Fund[];
}

const USCitizensFundsPage: React.FC<USCitizensFundsPageProps> = ({ initialFunds }) => {
  const { funds, loading } = useRealTimeFunds({ initialData: initialFunds });
  
  const [filters, setFilters] = useState<USFundsFilterState>({
    showConfirmedOnly: true,
    includeUnknown: false,
    category: 'all',
    feeRange: 'all',
    minInvestment: 'all'
  });

  // Get US eligibility status for a fund
  const getUSStatus = (fund: Fund): USEligibilityStatus => {
    // Check usCompliant field first (database source of truth)
    if (fund.usCompliant === true) return 'confirmed_yes';
    if (fund.usCompliant === false) return 'confirmed_no';
    
    // Check tag as secondary source
    if (fund.tags?.includes('Golden Visa funds for U.S. citizens')) {
      return 'confirmed_yes';
    }
    
    return 'unknown';
  };

  // Filter and sort funds
  const { usFunds, filteredFunds } = useMemo(() => {
    // First get all funds with potential US eligibility
    const allUSRelated = funds.filter(fund => {
      const status = getUSStatus(fund);
      return status === 'confirmed_yes' || status === 'unknown';
    });

    // Apply user filters
    let filtered = allUSRelated.filter(fund => {
      const status = getUSStatus(fund);
      
      // US eligibility filter
      if (filters.showConfirmedOnly && status !== 'confirmed_yes') return false;
      if (!filters.includeUnknown && status === 'unknown' && !filters.showConfirmedOnly) return false;
      
      // Category filter
      if (filters.category !== 'all' && fund.category !== filters.category) return false;
      
      // Fee range filter
      if (filters.feeRange !== 'all' && fund.managementFee !== null) {
        const fee = fund.managementFee;
        if (filters.feeRange === 'low' && fee >= 1.5) return false;
        if (filters.feeRange === 'medium' && (fee < 1.5 || fee > 2.5)) return false;
        if (filters.feeRange === 'high' && fee <= 2.5) return false;
      }
      
      // Minimum investment filter
      if (filters.minInvestment !== 'all' && fund.minimumInvestment) {
        const min = fund.minimumInvestment;
        if (filters.minInvestment === 'under250k' && min >= 250000) return false;
        if (filters.minInvestment === '250k-500k' && (min < 250000 || min > 500000)) return false;
        if (filters.minInvestment === 'over500k' && min <= 500000) return false;
      }
      
      return true;
    });

    // Sort: verified first, then confirmed US, then by rank
    filtered.sort((a, b) => {
      const statusA = getUSStatus(a);
      const statusB = getUSStatus(b);
      
      if (statusA === 'confirmed_yes' && statusB !== 'confirmed_yes') return -1;
      if (statusA !== 'confirmed_yes' && statusB === 'confirmed_yes') return 1;
      
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;
      
      return (a.finalRank ?? 999) - (b.finalRank ?? 999);
    });

    return { usFunds: allUSRelated, filteredFunds: filtered };
  }, [funds, filters]);

  const seoData = getUSCitizensFundsSeo(filteredFunds);
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });


  if (loading && (!funds || funds.length === 0)) {
    return <PageLoader />;
  }

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords?.join(', ')} />
        <link rel="canonical" href={seoData.canonical} />
        <meta name="robots" content={seoData.robots} />
        {seoData.structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.structuredData)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <USFundsBreadcrumbs />
            
            {/* Hero Section */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Flag className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Updated {lastUpdated}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Portugal Golden Visa Funds for US Citizens ({currentYear})
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
                A shortlist and directory view of funds that accept US persons (where confirmed). 
                Filter by fees, strategy and liquidity terms, with US-eligibility notes and sources where available.
              </p>
              
              {/* CTA Row */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setFilters(prev => ({ ...prev, showConfirmedOnly: true }))}
                  variant={filters.showConfirmedOnly ? 'default' : 'outline'}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Show Confirmed US-Eligible
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">
                    <List className="h-4 w-4 mr-2" />
                    Browse All Funds
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/compare">
                    <GitCompare className="h-4 w-4 mr-2" />
                    Compare Funds
                  </Link>
                </Button>
              </div>
            </section>

            {/* Definition Block */}
            <USDefinitionBlock />

            {/* Fund List Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {filters.showConfirmedOnly ? 'Confirmed US-eligible funds' : 'Funds for US persons'}
              </h2>
              
              <USFundsFilters 
                filters={filters}
                onFilterChange={setFilters}
                totalFunds={usFunds.length}
                filteredCount={filteredFunds.length}
              />
              
              {filteredFunds.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredFunds.map(fund => (
                    <USFundCard
                      key={fund.id}
                      fund={fund}
                      usStatus={getUSStatus(fund)}
                      sourceUrl={undefined} // TODO: Add source URL when database field is populated
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    No funds match your current filters.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setFilters({
                      showConfirmedOnly: false,
                      includeUnknown: true,
                      category: 'all',
                      feeRange: 'all',
                      minInvestment: 'all'
                    })}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </section>

            {/* Friction Points */}
            <USFrictionPoints />

            {/* Tax Topics */}
            <USTaxTopics />

            {/* Curated FAQ */}
            <USFundsFAQ />

            {/* Bottom CTA */}
            <section className="text-center py-8 border-t border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Need help comparing options?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Use our comparison tool to see funds side-by-side, or try the Fund Matcher quiz to find options that fit your preferences.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to="/compare">
                    Compare Funds <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/fund-matcher">
                    Try Fund Matcher
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default USCitizensFundsPage;
