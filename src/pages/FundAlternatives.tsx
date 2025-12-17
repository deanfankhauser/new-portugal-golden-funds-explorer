import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import { addTagsToFunds } from '../data/services/funds-service';
import { findAlternativeFunds } from '../data/services/alternative-funds-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { URL_CONFIG } from '../utils/urlConfig';
import { buildContactUrl, openExternalLink } from '../utils/urlHelpers';
import { Fund } from '../data/types/funds';

interface FundAlternativesProps {
  initialFunds?: Fund[];
}

const FundAlternatives: React.FC<FundAlternativesProps> = ({ initialFunds }) => {
  const { id } = useParams<{ id: string }>();
  const { funds: allFunds = [], loading: isLoading } = useRealTimeFunds({
    initialData: initialFunds
  });
  const fundsWithTags = addTagsToFunds(allFunds);
  const fund = fundsWithTags.find(f => f.id === id);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-muted-foreground">Loading fund alternatives...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // After data is loaded, check if fund exists
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

  const alternativeFunds = findAlternativeFunds(fundsWithTags, fund, 6);

  if (alternativeFunds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageSEO pageType="fund-alternatives" fundName={fund.name} />
        <Header />
        <main className="flex-1 py-6 md:py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/alternatives">Alternatives Hub</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={URL_CONFIG.buildFundUrl(fund.id)}>{fund.name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Alternatives</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {fund.name} Alternatives
            </h1>
            
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No alternative funds found similar to {fund.name}.
              </p>
              <Link to="/">
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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/alternatives">Alternatives Hub</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={URL_CONFIG.buildFundUrl(fund.id)}>{fund.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Alternatives</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="mb-8">
            <Alert className="mb-4">
              <AlertDescription>
                These are similar Golden Visa eligible funds. Verify specific details with counsel and fund managers.
              </AlertDescription>
            </Alert>
            
            {/* Link to Main Hub */}
            <div className="mb-6 text-center">
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
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {fund.name} Alternatives | Portugal Golden Visa Investment Funds
            </h1>
            <p className="text-muted-foreground text-lg">
              These are similar Golden Visa eligible funds with comparable investment strategies and requirements.
              Review each option to find the best match for your investment goals.
            </p>
          </div>

          <div className="grid gap-6">
            {alternativeFunds.map((alternativeFund) => (
              <Card key={alternativeFund.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground mb-2 flex items-center gap-2">
                        {alternativeFund.name}
                        {alternativeFund.isVerified && (
                          <Link to="/verification-program" className="inline-block hover:opacity-80 transition-opacity">
                            <span className="bg-success text-success-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md border-2 border-success/70 ring-2 ring-success/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              ✓ VERIFIED
                            </span>
                          </Link>
                        )}
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
                      <p className="text-muted-foreground">{alternativeFund.minimumInvestment > 0 ? formatCurrency(alternativeFund.minimumInvestment) : 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Return Target:</span>
                      <p className="text-muted-foreground">{alternativeFund.returnTarget}</p>
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
              Need Expert Introductions?
            </h2>
            <p className="text-muted-foreground mb-4">
              We can facilitate introductions to fund managers to help you evaluate these alternatives and find the perfect investment match.
            </p>
            <Button onClick={() => openExternalLink(buildContactUrl('alternatives-introduction'))} className="gap-2">
              Get Expert Introduction
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundAlternatives;