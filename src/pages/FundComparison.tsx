import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ComparisonTable from '../components/comparison/ComparisonTable';
import FundComparisonBreadcrumbs from '../components/comparison/FundComparisonBreadcrumbs';
import RelatedComparisons from '../components/comparison/RelatedComparisons';
import FundComparisonFAQ from '../components/comparison/FundComparisonFAQ';
import ComparisonFundCards from '../components/comparison/ComparisonFundCards';
import ComparisonQuickDecision from '../components/comparison/ComparisonQuickDecision';
import ComparisonCTASection from '../components/comparison/ComparisonCTASection';
import GeographicAllocationComparison from '../components/comparison/GeographicAllocationComparison';
import TotalCostSimulator from '../components/comparison/TotalCostSimulator';
import { parseComparisonSlug } from '../data/services/comparison-service';
import { normalizeComparisonSlug, isCanonicalComparisonSlug } from '../utils/comparisonUtils';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2, BarChart3 } from 'lucide-react';
import type { Fund } from '@/data/types/funds';

interface FundComparisonProps {
  initialSlug?: string;
  initialFunds?: Fund[];
}

const FundComparison: React.FC<FundComparisonProps> = ({ initialSlug, initialFunds }) => {
  const { slug: routerSlug } = useParams<{ slug: string }>();
  
  // During SSR, use passed initialFunds prop
  // During client-side, use the hook normally
  const isSSR = typeof window === 'undefined';
  
  // Use initialSlug during SSR, routerSlug on client
  const slug = isSSR ? initialSlug : routerSlug;
  
  let allFunds: Fund[] | undefined;
  let isLoading = false;
  let error = null;
  
  if (isSSR) {
    // SSR: Use directly passed funds data
    allFunds = initialFunds;
    console.log('🔥 SSR FundComparison: slug=%s, initialFunds length=%s', slug, allFunds?.length ?? 'undefined');
  } else {
    // Client-side: Use working hook
    const queryResult = useRealTimeFunds();
    allFunds = queryResult.funds;
    isLoading = queryResult.loading;
    error = queryResult.error;
  }
  
  // Check if slug needs canonicalization (redirect to normalized version)
  if (slug && !isCanonicalComparisonSlug(slug)) {
    const normalizedSlug = normalizeComparisonSlug(slug);
    return <Navigate to={`/compare/${normalizedSlug}`} replace />;
  }
  
  // Parse slug to get fund IDs
  const slugData = slug ? parseComparisonSlug(slug) : null;
  
  // Find the two funds from database data
  const fund1 = slugData && allFunds ? allFunds.find(f => f.id === slugData.fund1Id) : null;
  const fund2 = slugData && allFunds ? allFunds.find(f => f.id === slugData.fund2Id) : null;
  
  const comparisonData = fund1 && fund2 ? { fund1, fund2 } : null;
  const comparisonTitle = slug?.replace(/-/g, ' ') || '';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PageSEO pageType="fund-comparison" comparisonTitle={comparisonTitle} comparisonSlug={slug} />
        
        <Header />
        
        <main className="container mx-auto px-3 md:px-4 py-6 md:py-8 flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading comparison...</span>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // If no comparison data found or error, show error
  if (error || !comparisonData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PageSEO pageType="404" />
        
        <Header />
        
        <main className="container mx-auto px-3 md:px-4 py-6 md:py-8 flex-1">
          <Card className="bg-card p-6 rounded-lg shadow-sm">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Comparison Not Found</h1>
              <p className="text-muted-foreground">
                The fund comparison you're looking for could not be found.
              </p>
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="fund-comparison" comparisonTitle={comparisonTitle} comparisonSlug={slug} />
      
      {/* Subtle gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-muted/40 to-transparent pointer-events-none" />
      
      <Header />
      
      <main className="relative container mx-auto px-3 md:px-4 py-6 md:py-8 flex-1 max-w-5xl">
        {/* Breadcrumbs */}
        <nav className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-primary hover:text-primary/80 font-medium transition-colors">Funds</a>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-muted-foreground">Compare</span>
          </div>
        </nav>

        {/* Header with pill badge */}
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 bg-card rounded-full text-[12px] md:text-[13px] font-medium text-muted-foreground mb-4 md:mb-5 border border-border">
            <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            Golden Visa Fund Comparison
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-3 tracking-tight px-2">
            <span className="break-words">{comparisonData.fund1.name}</span>
            <span className="text-muted-foreground"> vs </span>
            <span className="break-words">{comparisonData.fund2.name}</span>
          </h1>
          <p className="text-[15px] md:text-[17px] text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Compare {comparisonData.fund1.name} and {comparisonData.fund2.name} side-by-side: fees, terms, performance metrics, and Golden Visa eligibility.
          </p>
        </header>

        <ComparisonFundCards fund1={comparisonData.fund1} fund2={comparisonData.fund2} />

        <ComparisonQuickDecision fund1={comparisonData.fund1} fund2={comparisonData.fund2} />

        <ComparisonTable funds={[comparisonData.fund1, comparisonData.fund2]} />

        <TotalCostSimulator fund1={comparisonData.fund1} fund2={comparisonData.fund2} />

        <GeographicAllocationComparison fund1={comparisonData.fund1} fund2={comparisonData.fund2} />

        <ComparisonCTASection />

        <FundComparisonFAQ 
          fund1={comparisonData.fund1} 
          fund2={comparisonData.fund2} 
        />

        <RelatedComparisons 
          currentFund1={comparisonData.fund1} 
          currentFund2={comparisonData.fund2} 
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default FundComparison;
