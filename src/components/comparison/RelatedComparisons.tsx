import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';
import { generateComparisonsFromFunds } from '../../data/services/comparison-service';
import { useAllFunds } from '@/hooks/useFundsQuery';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface RelatedComparisonsProps {
  currentFund1: Fund;
  currentFund2: Fund;
  maxComparisons?: number;
}

const RelatedComparisons: React.FC<RelatedComparisonsProps> = ({ 
  currentFund1, 
  currentFund2, 
  maxComparisons = 6 
}) => {
  // Fetch all funds from database
  const { data: allFunds } = useAllFunds();
  
  // Generate all comparisons from database funds
  const allComparisons = allFunds ? generateComparisonsFromFunds(allFunds) : [];
  
  // Filter out the current comparison and find related ones
  const currentSlug = `${[currentFund1.id, currentFund2.id].sort().join('-vs-')}`;
  
  const relatedComparisons = allComparisons
    .filter(comparison => comparison.slug !== currentSlug)
    .filter(comparison => 
      // Include comparisons that involve either of the current funds
      comparison.fund1.id === currentFund1.id || 
      comparison.fund1.id === currentFund2.id ||
      comparison.fund2.id === currentFund1.id || 
      comparison.fund2.id === currentFund2.id ||
      // Or same category as either fund
      comparison.fund1.category === currentFund1.category ||
      comparison.fund1.category === currentFund2.category ||
      comparison.fund2.category === currentFund1.category ||
      comparison.fund2.category === currentFund2.category
    )
    .slice(0, maxComparisons);

  if (relatedComparisons.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Related Fund Comparisons
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relatedComparisons.map(comparison => (
            <Link
              key={comparison.slug}
              to={`/compare/${comparison.slug}`}
              className="group block p-4 border border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {comparison.fund1.name} vs {comparison.fund2.name}
                </h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{comparison.fund1.category}</span>
                  <span>vs</span>
                  <span>{comparison.fund2.category}</span>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{comparison.fund1.managerName}</span>
                  <span>•</span>
                  <span>{comparison.fund2.managerName}</span>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>€{comparison.fund1.minimumInvestment.toLocaleString()}</span>
                  <span>vs</span>
                  <span>€{comparison.fund2.minimumInvestment.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link 
            to="/comparisons" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All Fund Comparisons
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedComparisons;