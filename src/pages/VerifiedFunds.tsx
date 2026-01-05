import React from 'react';
import { CheckCircle2, Shield } from 'lucide-react';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundListItem from '../components/FundListItem';
import VerificationStats from '../components/common/VerificationStats';
import VerificationExplainerModal from '../components/common/VerificationExplainerModal';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { Fund } from '../data/types/funds';

interface VerifiedFundsProps {
  initialFunds?: Fund[];
}

const VerifiedFunds: React.FC<VerifiedFundsProps> = ({ initialFunds }) => {
  const { funds: allFunds, loading } = useRealTimeFunds({
    initialData: initialFunds
  });
  
  // Filter for verified funds only
  const verifiedFunds = React.useMemo(() => {
    if (!allFunds) return [];
    return allFunds.filter(fund => fund.isVerified);
  }, [allFunds]);

  // Only show loading when no initial data was provided
  const showLoading = loading && !initialFunds;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO 
        pageType="verified-funds"
        funds={verifiedFunds}
      />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Verified Funds</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 bg-success/10 text-success px-6 py-3 rounded-full mb-6">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-lg">Verified Investment Funds</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Verified Portugal Golden Visa Investment Funds
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover investment funds that have been verified for regulatory compliance and authenticity. 
            Every verified fund meets our strict standards for transparency and legitimacy.
          </p>

          {/* Link Section */}
          <div className="mb-8">
            <a 
              href="https://www.movingto.com/portugal-golden-visa-funds" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Browse All Portugal Golden Visa Funds
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="font-medium">
              {verifiedFunds.length} Verified {verifiedFunds.length === 1 ? 'Fund' : 'Funds'}
            </span>
          </div>
        </div>

        {/* Verification Stats Widget */}
        <section className="mb-12">
          <VerificationStats funds={allFunds || []} variant="detailed" />
        </section>


        {/* Verified Funds List */}
        <section>
          <h2 className="text-3xl font-bold mb-8">
            All Verified Funds
          </h2>
          
          {showLoading ? (
            <FundListSkeleton />
          ) : verifiedFunds.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">No verified funds available at this time.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {verifiedFunds.map((fund) => (
                <FundListItem key={fund.id} fund={fund} />
              ))}
            </div>
          )}
        </section>

        {/* CTA to Verification Program */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
            <CardContent className="pt-8 pb-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Want to learn more about our verification process?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Discover exactly what we check, how we verify funds, and what the verification badge means for your investment decisions.
              </p>
              <Link to="/verification-program">
                <Button size="lg">
                  Learn About Our Verification Process
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerifiedFunds;
