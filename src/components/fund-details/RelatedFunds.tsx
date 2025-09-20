
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund, getFundsByCategory, funds } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, TrendingUp, DollarSign } from 'lucide-react';
import { categoryToSlug } from '@/lib/utils';

interface RelatedFundsProps {
  currentFund: Fund;
}

const RelatedFunds: React.FC<RelatedFundsProps> = ({ currentFund }) => {
  // Get funds from the same category
  const sameCategoryFunds = getFundsByCategory(currentFund.category)
    .filter(fund => fund.id !== currentFund.id)
    .slice(0, 3);

  // Get funds with similar minimum investment
  const similarInvestmentFunds = funds
    .filter(fund => 
      fund.id !== currentFund.id &&
      Math.abs(fund.minimumInvestment - currentFund.minimumInvestment) <= 100000
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Same Category Funds */}
      {sameCategoryFunds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              More {currentFund.category} Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sameCategoryFunds.map(fund => (
                <div key={fund.id} className="border border-border rounded-lg p-4 hover:border-accent transition-colors">
                  <Link to={`/${fund.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <h4 className="font-semibold text-foreground mb-2 hover:text-accent transition-colors">
                      {fund.name}
                    </h4>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{fund.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                    <span>Min: €{fund.minimumInvestment.toLocaleString()}</span>
                    <span>Fee: {fund.managementFee}%</span>
                  </div>
                  <Link to={`/${fund.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link to={`/categories/${categoryToSlug(currentFund.category)}`}>
                <Button variant="ghost" size="sm">
                  View All {currentFund.category} Funds →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Similar Investment Amount Funds */}
      {similarInvestmentFunds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Similar Investment Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarInvestmentFunds.map(fund => (
                <div key={fund.id} className="border border-border rounded-lg p-4 hover:border-accent transition-colors">
                  <Link to={`/${fund.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <h4 className="font-semibold text-foreground mb-2 hover:text-accent transition-colors">
                      {fund.name}
                    </h4>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{fund.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                    <span>Min: €{fund.minimumInvestment.toLocaleString()}</span>
                    <span>{fund.category}</span>
                  </div>
                  <Link to={`/${fund.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RelatedFunds;
