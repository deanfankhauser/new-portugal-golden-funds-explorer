import React from 'react';
import { CheckCircle2, Shield, Award, TrendingUp } from 'lucide-react';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundListItem from '../components/FundListItem';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import FundListSkeleton from '../components/common/FundListSkeleton';

const VerifiedFunds = () => {
  const { funds: allFunds, loading: isLoading, error } = useRealTimeFunds();
  
  // Filter for verified funds only
  const verifiedFunds = React.useMemo(() => {
    return allFunds?.filter(fund => fund.isVerified) || [];
  }, [allFunds]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO 
        pageType="fund-index"
        fundName="Verified Funds"
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
            Trusted & Verified Funds
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover investment funds that have been verified for regulatory compliance and authenticity. 
            Every verified fund meets our strict standards for transparency and legitimacy.
          </p>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="font-medium">
              {verifiedFunds.length} Verified {verifiedFunds.length === 1 ? 'Fund' : 'Funds'}
            </span>
          </div>
        </div>

        {/* What Verification Means Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">What Does Verification Mean?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-success/20 hover:border-success/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Regulatory Compliance</CardTitle>
                <CardDescription>
                  Verified funds have confirmed regulatory registration with CMVM (Portuguese Securities Market Commission) 
                  and comply with all applicable investment fund regulations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-success/20 hover:border-success/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Authenticity Confirmed</CardTitle>
                <CardDescription>
                  Fund managers and investment details have been cross-referenced with official sources 
                  to ensure accuracy and legitimacy of all information presented.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-success/20 hover:border-success/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Quality Standards</CardTitle>
                <CardDescription>
                  Verified funds meet our quality benchmarks for transparency, documentation completeness, 
                  and adherence to industry best practices.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Why It Matters Section */}
        <section className="mb-12">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-2xl">Why Verification Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Investor Protection</h3>
                  <p className="text-muted-foreground">
                    Verification helps protect investors from fraudulent schemes and ensures funds operate within legal frameworks.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Due Diligence Confidence</h3>
                  <p className="text-muted-foreground">
                    Save time on research by focusing on funds that have already passed rigorous verification checks.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Transparency & Trust</h3>
                  <p className="text-muted-foreground">
                    Verified funds demonstrate commitment to transparency and regulatory compliance, building investor trust.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Verified Funds List */}
        <section>
          <h2 className="text-3xl font-bold mb-8">
            All Verified Funds
          </h2>
          
          {isLoading ? (
            <FundListSkeleton />
          ) : error ? (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">Error loading funds. Please try again later.</p>
              </CardContent>
            </Card>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default VerifiedFunds;
