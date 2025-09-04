import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';
import { funds } from '../../data/funds';
import { normalizeComparisonSlug } from '../../utils/comparisonUtils';
import { URL_CONFIG } from '../../utils/urlConfig';
import { GitCompare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FundComparisonSuggestionsProps {
  currentFund: Fund;
}

const FundComparisonSuggestions: React.FC<FundComparisonSuggestionsProps> = ({ currentFund }) => {
  // Find similar funds based on category and size
  const suggestedFunds = funds
    .filter(fund => 
      fund.id !== currentFund.id && 
      (fund.category === currentFund.category || 
       Math.abs((fund.minimumInvestment || 0) - (currentFund.minimumInvestment || 0)) < 100000)
    )
    .slice(0, 3);

  if (suggestedFunds.length === 0) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-primary" />
          Compare {currentFund.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Compare {currentFund.name} with similar investment funds to analyze performance, fees, and investment requirements.
        </p>
        <div className="grid gap-3">
          {suggestedFunds.map((fund) => {
            const comparisonSlug = normalizeComparisonSlug(`${currentFund.id}-vs-${fund.id}`);
            const comparisonUrl = URL_CONFIG.buildUrl(`compare/${comparisonSlug}`);
            
            return (
              <Link
                key={fund.id}
                to={comparisonUrl}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-sm">{currentFund.name} vs {fund.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Compare {fund.category} • Min. {fund.minimumInvestment > 0 ? `€${fund.minimumInvestment.toLocaleString()}` : 'Not provided'}
                  </div>
                </div>
                <GitCompare className="h-4 w-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FundComparisonSuggestions;