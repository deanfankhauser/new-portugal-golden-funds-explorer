import React from 'react';
import { useParams } from 'react-router-dom';
import { getFundById } from '../data/funds';
import { findAlternativeFunds } from '../data/services/alternative-funds-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const FundAlternatives = () => {
  const { id } = useParams<{ id: string }>();
  const fund = id ? getFundById(id) : null;

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageSEO pageType="404" />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Fund Not Found</h1>
            <p className="text-muted-foreground">The fund you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const alternativeFunds = findAlternativeFunds(fund, 6);

  if (alternativeFunds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageSEO pageType="fund-alternatives" fundName={fund.name} />
        <Header />
        {/* Add noindex for pages with no alternatives */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof document !== 'undefined') {
              let robots = document.querySelector('meta[name="robots"]');
              if (!robots) {
                robots = document.createElement('meta');
                robots.setAttribute('name', 'robots');
                document.head.appendChild(robots);
              }
              robots.setAttribute('content', 'noindex, follow');
            }
          `
        }} />
        <main className="flex-1 py-6 md:py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-6">
              <Link 
                to={`/${fund.id}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {fund.name}
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {fund.name} Alternatives
            </h1>
            
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No alternative funds found similar to {fund.name}.
              </p>
              <Link to="/index">
                <Button>Browse All Funds</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-success/10 text-success border-success/20';
      case 'Closing Soon':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Closed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund-alternatives" fundName={fund.name} />
      
      <Header />
      
      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link 
              to={`/${fund.id}`}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {fund.name}
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {fund.name} Alternatives | Portugal Golden Visa Investment Funds
            </h1>
            <p className="text-muted-foreground text-lg">
              These are similar funds. Eligibility varies — check the badge on each card. 
              To view non-GV alternatives only, use the Real Estate or other non-GV categories.
            </p>
          </div>

          <div className="grid gap-6">
            {alternativeFunds.map((alternativeFund) => (
              <Card key={alternativeFund.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground mb-2">
                        {alternativeFund.name}
                      </CardTitle>
                      <Badge className={`${getStatusColor(alternativeFund.fundStatus)} mb-3`}>
                        {alternativeFund.fundStatus}
                      </Badge>
                    </div>
                    <Link to={`/${alternativeFund.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        View Details
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {alternativeFund.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Minimum Investment:</span>
                      <p className="text-muted-foreground">{formatCurrency(alternativeFund.minimumInvestment)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Return Target:</span>
                      <p className="text-muted-foreground">{alternativeFund.returnTarget}%</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Term:</span>
                      <p className="text-muted-foreground">{alternativeFund.term} years</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Category:</span>
                      <p className="text-muted-foreground">{alternativeFund.category}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="font-medium text-foreground">Manager:</span>
                    <p className="text-muted-foreground">{alternativeFund.managerName}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-card rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Need Portugal Golden Visa Investment Fund Guidance?
            </h2>
            <p className="text-muted-foreground mb-4">
              Our fund experts can help you evaluate these alternatives and find the perfect investment match for your goals.
            </p>
            <Button asChild>
              <Link to="/about">Get Expert Guidance</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundAlternatives;