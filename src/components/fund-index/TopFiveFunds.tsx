
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface TopFiveFundsProps {
  scores: FundScore[];
}

const TopFiveFunds: React.FC<TopFiveFundsProps> = ({ scores }) => {
  // Remove component-level schema injection - ConsolidatedSEOService handles page-level schemas

  return (
    <section 
      id="top-five" 
      itemScope 
      itemType="https://schema.org/Table"
      aria-labelledby="top-five-title"
    >
      <Card className="border border-border bg-card">
        <CardHeader className="border-b border-border bg-card">
          <CardTitle 
            id="top-five-title"
            className="text-xl font-semibold text-foreground"
            itemProp="name"
          >
            Top 5 Funds
          </CardTitle>
          <p 
            className="text-sm text-muted-foreground mt-1"
            itemProp="description"
          >
            Ranked by comprehensive scoring methodology
          </p>
        </CardHeader>
        <CardContent className="p-0" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
          <div className="divide-y divide-border">
            {scores.map((score, index) => {
              const fund = getFundById(score.fundId);
              if (!fund) return null;

              return (
                <article 
                  key={score.fundId} 
                  className="p-6 hover:bg-muted/30 transition-colors"
                  itemScope 
                  itemType="https://schema.org/FinancialProduct"
                  itemProp="itemListElement"
                >
                  <meta itemProp="position" content={(index + 1).toString()} />
                  <meta itemProp="identifier" content={fund.id} />
                  <meta itemProp="category" content={fund.category} />
                  
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="text-lg font-medium text-foreground truncate"
                            itemProp="name"
                          >
                            {fund.name}
                          </h3>
                          {fund.isVerified && (
                            <div className="bg-success text-success-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md border-2 border-success/70 ring-2 ring-success/20 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>✓ VERIFIED</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div itemScope itemType="https://schema.org/AggregateRating">
                            <div 
                              className="text-xl font-semibold text-foreground"
                              itemProp="ratingValue"
                            >
                              {score.movingtoScore}
                            </div>
                            <div className="text-xs text-muted-foreground">Score</div>
                            <meta itemProp="bestRating" content="100" />
                            <meta itemProp="worstRating" content="0" />
                            <meta itemProp="ratingCount" content="1" />
                          </div>
                          <div itemScope itemType="https://schema.org/PropertyValue">
                            <div 
                              className="text-lg font-medium text-accent"
                              itemProp="value"
                            >
                              {fund.managementFee}%
                            </div>
                            <div className="text-xs text-muted-foreground" itemProp="name">Mgmt Fee</div>
                          </div>
                        </div>
                        
                        <div itemScope itemType="https://schema.org/Offer">
                          <meta itemProp="price" content={fund.minimumInvestment.toString()} />
                          <meta itemProp="priceCurrency" content="EUR" />
                          <meta itemProp="availability" content={fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
                        </div>
                        
                        <div itemScope itemType="https://schema.org/Organization" itemProp="provider">
                          <meta itemProp="name" content={fund.managerName} />
                          <meta itemProp="url" content={fund.websiteUrl} />
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Link 
                        to={`/${fund.id}`}
                        itemProp="url"
                      >
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          
          <footer 
            className="p-6 border-t border-border bg-muted/30"
            itemProp="caption"
          >
            <p className="text-sm text-muted-foreground text-center">
              Rankings updated monthly based on performance, regulation compliance, and fee analysis.
            </p>
          </footer>
        </CardContent>
      </Card>
    </section>
  );
};

export default TopFiveFunds;
