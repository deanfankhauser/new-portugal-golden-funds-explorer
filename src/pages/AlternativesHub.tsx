import React from 'react';
import { Link } from 'react-router-dom';
import { fundsData } from '../data/mock/funds';
import { findAlternativeFunds } from '../data/services/alternative-funds-service';
import { isFundGVEligible } from '../data/services/gv-eligibility-service';
import { PageSEO } from '../components/common/PageSEO';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight, TrendingUp } from 'lucide-react';

const AlternativesHub: React.FC = () => {
  // All funds are now GV eligible, so show general alternatives
  const allFunds = fundsData;
  
  // Get funds that have alternatives for general comparison
  const fundsWithAlternatives = allFunds
    .map(fund => ({
      fund,
      alternatives: findAlternativeFunds(fund, 3)
    }))
    .filter(item => item.alternatives.length > 0)
    .sort((a, b) => b.alternatives.length - a.alternatives.length);

  return (
    <>
      <PageSEO pageType="alternatives-hub" />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Portugal Investment Fund Alternatives Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover similar Golden Visa eligible funds based on category, investment requirements, and performance metrics.
              Compare alternatives to find the perfect fund for your needs.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{fundsWithAlternatives.length}</div>
                <div className="text-muted-foreground">Funds with Alternatives</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground">{allFunds.length}</div>
                <div className="text-muted-foreground">Total GV Funds</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {fundsWithAlternatives.length > 0 
                    ? Math.round(fundsWithAlternatives.reduce((sum, item) => sum + item.alternatives.length, 0) / fundsWithAlternatives.length)
                    : 0
                  }
                </div>
                <div className="text-muted-foreground">Avg. Alternatives per Fund</div>
              </CardContent>
            </Card>
          </div>

          {/* Funds List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Browse Portugal Golden Visa Investment Fund Alternatives
            </h2>
            
            <div className="grid gap-6">
              {fundsWithAlternatives.map(({ fund, alternatives }) => (
                <Card key={fund.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          <Link 
                            to={`/${fund.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {fund.name}
                          </Link>
                        </CardTitle>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="secondary">{fund.category}</Badge>
                          <Badge variant="outline">{fund.fundStatus}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Minimum Investment: €{fund.minimumInvestment.toLocaleString()} | 
                          Fund Size: €{fund.fundSize}M | 
                          Term: {fund.term} years
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {alternatives.length} alternatives
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Similar Funds:</h4>
                      <div className="grid gap-2">
                        {(alternatives || []).filter(Boolean).map(alt => (
                          <div key={(alt as any).id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <div>
                              <Link 
                                to={`/${(alt as any).id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {(alt as any).name ?? 'Unnamed fund'}
                              </Link>
                              <div className="text-sm text-muted-foreground">
                                {(alt as any).category} | €{Number((alt as any).minimumInvestment || 0).toLocaleString()} min
                              </div>
                            </div>
                            <Badge variant={(alt as any).fundStatus === 'Open' ? 'default' : 'secondary'}>
                              {(alt as any).fundStatus ?? 'Unknown'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <Link 
                        to={`/${fund.id}/alternatives`}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                      >
                        View all alternatives for {fund.name}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Looking for Something Specific?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Use our comprehensive fund index to filter by category, investment amount, 
                  risk level, and more to find the perfect fund for your needs.
                </p>
                <Link 
                  to="/index"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Browse All Funds
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlternativesHub;