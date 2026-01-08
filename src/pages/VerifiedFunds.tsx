import React from 'react';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundListItem from '../components/FundListItem';
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Verified Portugal Golden Visa Investment Funds
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover investment funds that have been verified for regulatory compliance and authenticity. 
            Every verified fund meets our strict standards for transparency and legitimacy.
          </p>
        </div>


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
