import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAllFunds } from '../hooks/useFundsQuery';
import { findAlternativeFunds } from '../data/services/alternative-funds-service';
import { PageSEO } from '../components/common/PageSEO';
import VerificationFilterChip from '../components/common/VerificationFilterChip';
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

const AlternativesHub: React.FC = () => {
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const { data: fundsData = [], isLoading } = useAllFunds();
  
  // Filter funds by verification status
  const filteredFunds = useMemo(() => {
    if (!showOnlyVerified) return fundsData;
    return fundsData.filter(fund => fund.isVerified);
  }, [showOnlyVerified, fundsData]);
  
  // Filter out any invalid fund entries
  const allFunds = filteredFunds.filter((f): f is typeof f & { name: string; id: string } => 
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

  if (isLoading) {
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
      <div className="mb-6">
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
              <BreadcrumbPage>Fund Alternatives</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="mb-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Find Alternative Investment Funds
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover similar Golden Visa eligible funds based on category, investment requirements, and performance metrics.
            Compare alternatives to make informed investment decisions.
          </p>
        </div>
      </section>
      
      {/* Verification Filter Toolbar */}
      <div className="mb-8 flex items-center gap-4 flex-wrap">
        <VerificationFilterChip 
          showOnlyVerified={showOnlyVerified}
          setShowOnlyVerified={setShowOnlyVerified}
        />
        <span className="text-sm text-muted-foreground">
          {showOnlyVerified 
            ? `Showing ${verifiedCount} verified funds` 
            : `Showing all ${allFunds.length} funds (${verifiedCount} verified)`
          }
        </span>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <Card className="border-border/50 hover:border-border transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">{fundsWithAlternatives.length}</div>
                <div className="text-sm text-muted-foreground">Funds with Alternatives</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 hover:border-border transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">{allFunds.length}</div>
                <div className="text-sm text-muted-foreground">Total Funds</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 hover:border-border transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">{totalAlternatives}</div>
                <div className="text-sm text-muted-foreground">Alternative Matches</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funds with Alternatives */}
      <div className="space-y-6">
        {fundsWithAlternatives.map(({ fund, alternatives }) => (
          <Card key={fund.id} className="border-border/50 hover:shadow-md transition-all">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-3">
                    <Link 
                      to={`/fund/${fund.id}`}
                      className="hover:text-primary transition-colors inline-flex items-center gap-2 group"
                    >
                      {fund.name}
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {fund.category && (
                      <Badge variant="secondary" className="font-normal">{fund.category}</Badge>
                    )}
                    {fund.isVerified && (
                      <Badge className="bg-emerald-600 hover:bg-emerald-700 font-normal">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {fund.minimumInvestment && (
                      <Badge variant="outline" className="font-normal">
                        Min: €{fund.minimumInvestment.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Similar Alternatives
                </h3>
                <Badge variant="outline" className="text-xs">{alternatives.length}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {alternatives.map((alt) => (
                  <Link 
                    key={alt.id}
                    to={`/fund/${alt.id}`}
                    className="group block p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:shadow-sm transition-all"
                  >
                    <div className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {alt.name}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {alt.category && (
                        <Badge variant="outline" className="text-xs font-normal">{alt.category}</Badge>
                      )}
                      {alt.isVerified && (
                        <Badge variant="outline" className="text-xs font-normal bg-emerald-50 text-emerald-700 border-emerald-200">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    {alt.minimumInvestment && (
                      <div className="text-xs text-muted-foreground">
                        Min: €{alt.minimumInvestment.toLocaleString()}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <section className="mt-16 bg-gradient-to-br from-primary/5 to-primary/10 border border-border/50 rounded-lg p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Ready to Compare More Funds?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Browse our complete directory of Portugal Golden Visa investment funds
          and find the perfect match for your investment goals.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            Browse All Funds
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </HomepageLayout>
  );
};

export default AlternativesHub;
