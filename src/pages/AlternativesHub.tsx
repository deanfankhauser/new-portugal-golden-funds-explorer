import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import { findAlternativeFunds } from '../data/services/alternative-funds-service';
import { PageSEO } from '../components/common/PageSEO';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowRight, Layers, Users, CheckCircle2, Home } from 'lucide-react';
import HomepageLayout from '../components/homepage/HomepageLayout';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '../components/ui/breadcrumb';
import { InvestmentFundStructuredDataService } from '../services/investmentFundStructuredDataService';
import { StructuredDataService } from '../services/structuredDataService';
import { URL_CONFIG } from '../utils/urlConfig';
import { Fund } from '../data/types/funds';

interface AlternativesHubProps {
  initialFunds?: Fund[];
}

const AlternativesHub: React.FC<AlternativesHubProps> = ({ initialFunds }) => {
  const [displayCount, setDisplayCount] = useState(10);
  const { funds: fundsData = [], loading: isLoading } = useRealTimeFunds({
    initialData: initialFunds
  });
  
  // Filter out any invalid fund entries
  const allFunds = fundsData.filter((f): f is typeof f & { name: string; id: string } =>
    !!f && typeof f === 'object' && 
    typeof f.name === 'string' && 
    typeof f.id === 'string' &&
    f.name.trim() !== ''
  );
  
  // Get funds that have alternatives for general comparison
  const fundsWithAlternatives = allFunds
    .map(fund => {
      try {
        const alternatives = findAlternativeFunds(allFunds, fund, 3).filter(
          (alt): alt is typeof alt & { name: string; id: string } => 
            !!alt && typeof alt.name === 'string' && typeof alt.id === 'string'
        );
        return { fund, alternatives };
      } catch (error) {
        console.error(`Error finding alternatives for fund ${fund.id}:`, error);
        return { fund, alternatives: [] };
      }
    })
    .filter(item => item.alternatives.length > 0)
    .sort((a, b) => b.alternatives.length - a.alternatives.length);

  const verifiedCount = allFunds.filter(f => f.isVerified).length;
  const totalAlternatives = fundsWithAlternatives.reduce((sum, item) => sum + item.alternatives.length, 0);

  // Add structured data for SEO
  useEffect(() => {
    if (fundsWithAlternatives.length > 0 && typeof window !== 'undefined') {
      const schemas = [
        InvestmentFundStructuredDataService.generateFundListSchema(
          fundsWithAlternatives.map(item => item.fund),
          'fund-alternatives'
        ),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': 'Fund Alternatives Hub - Portugal Golden Visa Investment Funds',
          'description': 'Discover similar Golden Visa eligible funds based on category, investment requirements, and performance metrics.',
          'url': window.location.href,
          'numberOfItems': fundsWithAlternatives.length,
          'about': {
            '@type': 'FinancialProduct',
            'name': 'Portugal Golden Visa Investment Funds'
          }
        }
      ];
      StructuredDataService.addStructuredData(schemas, 'alternatives-hub-schema');
    }
    
    return () => {
      StructuredDataService.removeStructuredData('alternatives-hub-schema');
    };
  }, [fundsWithAlternatives]);

  const displayedFunds = fundsWithAlternatives.slice(0, displayCount);
  const hasMore = displayCount < fundsWithAlternatives.length;

  // Only show loading when no initial data was provided
  if (isLoading && !initialFunds) {
    return (
      <HomepageLayout>
        <PageSEO pageType="alternatives-hub" />
        <div className="text-center py-12">
          <div className="animate-pulse">Loading funds data...</div>
        </div>
      </HomepageLayout>
    );
  }

  return (
    <HomepageLayout>
      <PageSEO pageType="alternatives-hub" />
      
      {/* Breadcrumb Navigation */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Alternatives Hub</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* Hero Section */}
      <section className="mb-12" aria-labelledby="page-title">
        <div className="max-w-3xl">
          <h1 id="page-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Portugal Golden Visa Fund Alternatives Hub
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover similar Golden Visa eligible funds based on category, investment requirements, and performance metrics.
            Compare alternatives to make informed investment decisions.
          </p>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="mb-12" aria-labelledby="statistics-heading">
        <h2 id="statistics-heading" className="sr-only">Fund Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Funds with Alternatives
                </CardTitle>
                <Layers className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{fundsWithAlternatives.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Investment options</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Funds
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{allFunds.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Golden Visa eligible</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Alternative Matches
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalAlternatives}</div>
              <p className="text-xs text-muted-foreground mt-1">Similar fund matches</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-1">Browse Fund Alternatives</h2>
        <p className="text-sm text-muted-foreground">
          Showing all {allFunds.length} funds
        </p>
      </div>

      {/* Funds with Alternatives */}
      <section aria-labelledby="funds-list-heading">
        <h2 id="funds-list-heading" className="sr-only">List of Funds with Alternatives</h2>
        <div className="space-y-6 mb-8">
          {displayedFunds.map(({ fund, alternatives }) => (
            <Card 
              key={fund.id} 
              className="overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="bg-accent/20 border-b border-border/50">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={URL_CONFIG.buildFundAlternativesUrl(fund.id)}
                      className="hover:underline"
                    >
                      <CardTitle className="text-xl mb-2 text-foreground">
                        {fund.name}
                      </CardTitle>
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap">
                      {fund.category && (
                        <Badge variant="secondary" className="text-xs">
                          {fund.category}
                        </Badge>
                      )}
                      {fund.isVerified && (
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={URL_CONFIG.buildFundAlternativesUrl(fund.id)}>
                      View Alternatives
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                  Similar Alternatives ({alternatives.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {alternatives.map(alt => (
                    <Link
                      key={alt.id}
                      to={URL_CONFIG.buildFundUrl(alt.id)}
                      className="group block p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/30 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                          {alt.name}
                        </h4>
                        {alt.isVerified && (
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                      
                      {alt.category && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {alt.category}
                        </Badge>
                      )}
                      
                      {alt.minimumInvestment && (
                        <p className="text-sm text-muted-foreground">
                          Min: €{alt.minimumInvestment.toLocaleString()}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-1 text-xs text-primary mt-2 group-hover:gap-2 transition-all">
                        <span>Learn more</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mb-16">
            <Button 
              onClick={() => setDisplayCount(prev => prev + 10)}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
              aria-label={`Load ${Math.min(10, fundsWithAlternatives.length - displayCount)} more funds`}
            >
              Load More Funds
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Showing {displayCount} of {fundsWithAlternatives.length} funds
            </p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-accent/30 rounded-xl p-8 md:p-12 text-center" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Ready to Explore All Funds?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Browse our complete collection of Portugal Golden Visa investment funds to find the perfect match for your investment goals.
        </p>
        <Button asChild size="lg" className="font-semibold">
          <Link to="/funds">
            Browse All Funds
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Link to Main Hub */}
      <div className="mt-8 text-center">
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
    </HomepageLayout>
  );
};

export default AlternativesHub;
