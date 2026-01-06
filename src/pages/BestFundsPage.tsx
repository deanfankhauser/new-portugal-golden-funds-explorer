import React from 'react';
import { Link } from 'react-router-dom';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { getSortedBestFunds, getBestFundsByCategory } from '@/utils/fundScoring';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Compass, GitCompare, Search, Calendar } from 'lucide-react';
import BestFundCard from '@/components/best-funds/BestFundCard';
import BestFundCluster from '@/components/best-funds/BestFundCluster';
import RankingMethodology from '@/components/best-funds/RankingMethodology';
import CommonMistakes from '@/components/best-funds/CommonMistakes';
import CompareModule from '@/components/best-funds/CompareModule';
import BestFundsFAQ from '@/components/best-funds/BestFundsFAQ';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import type { Fund } from '@/data/types/funds';

interface BestFundsPageProps {
  initialFunds?: Fund[];
}

const BestFundsPage: React.FC<BestFundsPageProps> = ({ initialFunds }) => {
  const { funds, loading } = useRealTimeFunds({ initialData: initialFunds });
  
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
  
  // Get scored and sorted funds
  const bestOverallFunds = getSortedBestFunds(funds, 8);
  const fundClusters = getBestFundsByCategory(funds);
  
  if (loading) {
    return <PageLoader />;
  }
  
  return (
    <>
      <PageSEO 
        pageType="best-funds" 
        fundsCount={bestOverallFunds.length}
      />
      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Best Funds ({currentYear})</span>
          </nav>
          
          {/* Hero Section */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="text-xs font-medium flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Last updated: {lastUpdated}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Best Portugal Golden Visa Funds ({currentYear})
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
              A shortlist of the best Portugal Golden Visa funds for the €500k route—ranked by 
              disclosed factors like fees, liquidity terms, strategy, and governance signals.
            </p>
            
            <p className="text-sm text-muted-foreground/80 mb-8">
              Disclosure-led profiles. Built for shortlisting, not advice.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/funds">
                <Button variant="outline" size="lg" className="gap-2">
                  <Search className="h-4 w-4" />
                  Browse All Funds
                </Button>
              </Link>
              <Link to="/compare">
                <Button variant="outline" size="lg" className="gap-2">
                  <GitCompare className="h-4 w-4" />
                  Compare Funds
                </Button>
              </Link>
              <Link to="/fund-matcher">
                <Button size="lg" className="gap-2">
                  <Compass className="h-4 w-4" />
                  Find a Fund
                </Button>
              </Link>
            </div>
          </header>
          
          {/* Methodology Section */}
          <section className="mb-10">
            <RankingMethodology />
          </section>
          
          {/* Best Overall Shortlist */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Best Portugal Golden Visa Funds Overall (Balanced Criteria)
            </h2>
            <p className="text-muted-foreground mb-6">
              Top-scoring funds across all factors. Each fund has sufficient data to justify inclusion.
            </p>
            
            {bestOverallFunds.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bestOverallFunds.map((scoredFund, index) => (
                  <BestFundCard 
                    key={scoredFund.fund.id} 
                    scoredFund={scoredFund}
                    rank={index + 1}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No funds currently meet our data completeness requirements.</p>
            )}
          </section>
          
          {/* Best By Priority Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Best Funds by Priority
            </h2>
            
            {fundClusters.map((cluster) => (
              <BestFundCluster key={cluster.id} cluster={cluster} />
            ))}
          </section>
          
          {/* Common Mistakes */}
          <CommonMistakes />
          
          {/* Compare Module */}
          <CompareModule />
          
          {/* FAQ Section */}
          <BestFundsFAQ />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BestFundsPage;
