
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import IntroductionButton from '../fund-details/IntroductionButton';
import { ExternalLink, TrendingUp, Clock, Euro } from 'lucide-react';
import { Fund } from '@/data/types/funds';

interface RecommendationCardProps {
  fund: Fund & { score: number };
  index: number;
  formatCurrency: (amount: number) => string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ fund, index, formatCurrency }) => {
  return (
    <Card className="relative overflow-hidden">
      {index === 0 && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
          Top Match
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fund Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{fund.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{fund.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Min Investment</p>
                  <p className="font-semibold">{formatCurrency(fund.minimumInvestment)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Target Return</p>
                  <p className="font-semibold">{fund.returnTarget}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Term</p>
                  <p className="font-semibold">{fund.term} years</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Fund Manager:</span> {fund.managerName}
              </p>
              <div className="flex flex-wrap gap-1">
                {fund.tags.slice(0, 6).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {fund.tags.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{fund.tags.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="text-center">
              <IntroductionButton variant="compact" />
              <p className="text-xs text-gray-500 mt-2">
                Get personalized introduction and preferential terms
              </p>
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`/${fund.id}`, '_blank', 'noopener,noreferrer')}
                className="w-full"
              >
                View Details
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
