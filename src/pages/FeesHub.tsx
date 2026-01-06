import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, GitCompare, Calculator, Calendar } from 'lucide-react';
import FeeTypeCard from '@/components/fees-hub/FeeTypeCard';
import TotalCostBreakdown from '@/components/fees-hub/TotalCostBreakdown';
import FeeEstimatorModule from '@/components/fees-hub/FeeEstimatorModule';
import FeeCommonTraps from '@/components/fees-hub/FeeCommonTraps';
import FeesHubFAQ from '@/components/fees-hub/FeesHubFAQ';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import { 
  getFundsWithDisclosedManagementFee,
  getFundsWithDisclosedPerformanceFee,
  getFundsWithSubscriptionFee,
  getFundsWithRedemptionFee 
} from '@/utils/feeFilters';
import type { Fund } from '@/data/types/funds';

interface FeesHubProps {
  initialFunds?: Fund[];
}

const FeesHub: React.FC<FeesHubProps> = ({ initialFunds }) => {
  const { funds, loading } = useRealTimeFunds({ initialData: initialFunds });
  
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Calculate funds with each fee type disclosed
  const managementFeeFunds = getFundsWithDisclosedManagementFee(funds);
  const performanceFeeFunds = getFundsWithDisclosedPerformanceFee(funds);
  const subscriptionFeeFunds = getFundsWithSubscriptionFee(funds);
  const redemptionFeeFunds = getFundsWithRedemptionFee(funds);
  
  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <PageSEO pageType="fees-hub" />
      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Fees</span>
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
              Portugal Golden Visa Fund Fees ({currentYear})
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
              Understand fee types and compare how funds charge them. Use this guide to estimate 
              total costs and make informed comparisons.
            </p>
            
            <p className="text-sm text-muted-foreground/80 mb-8">
              Fee information is based on disclosed sources and may change. This is not investment advice—verify fees and terms in official documents.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/funds">
                <Button variant="outline" size="lg" className="gap-2">
                  <Search className="h-4 w-4" />
                  Browse Funds
                </Button>
              </Link>
              <Link to="/compare">
                <Button variant="outline" size="lg" className="gap-2">
                  <GitCompare className="h-4 w-4" />
                  Compare Funds
                </Button>
              </Link>
              <a href="#estimator">
                <Button size="lg" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  Estimate Total Cost
                </Button>
              </a>
            </div>
          </header>
          
          {/* Fee Types Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Fee Types Explained
            </h2>
            <p className="text-muted-foreground mb-6">
              Click on a fee type to learn more and see funds with that fee disclosed.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeeTypeCard 
                slug="management-fee"
                title="Management Fee"
                description="Annual fee charged as a percentage of assets under management"
                fundsCount={managementFeeFunds.length}
              />
              <FeeTypeCard 
                slug="performance-fee"
                title="Performance Fee"
                description="Fee charged on investment gains above a specified threshold"
                fundsCount={performanceFeeFunds.length}
              />
              <FeeTypeCard 
                slug="subscription-fee"
                title="Subscription / Entry Fee"
                description="One-time fee charged when you invest in the fund"
                fundsCount={subscriptionFeeFunds.length}
              />
              <FeeTypeCard 
                slug="redemption-fee"
                title="Redemption Fee"
                description="Fee charged when withdrawing your investment"
                fundsCount={redemptionFeeFunds.length}
              />
              <FeeTypeCard 
                slug="exit-fee"
                title="Exit Fee"
                description="Fee charged at the end of an investment or fund maturity"
                fundsCount={redemptionFeeFunds.length}
              />
              <FeeTypeCard 
                slug="total-cost"
                title="Total Cost Estimator"
                description="Calculate the combined impact of all fees on your investment"
              />
            </div>
          </section>
          
          {/* Total Cost Breakdown */}
          <TotalCostBreakdown />
          
          {/* Fee Estimator */}
          <section className="mt-12">
            <FeeEstimatorModule />
          </section>
          
          {/* Common Traps */}
          <section className="mt-12">
            <FeeCommonTraps />
          </section>
          
          {/* FAQ */}
          <FeesHubFAQ />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default FeesHub;
