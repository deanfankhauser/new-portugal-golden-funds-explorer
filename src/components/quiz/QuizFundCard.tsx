import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fund } from '@/data/types/funds';
import { Mail, ChevronRight, CheckCircle, TrendingUp, Clock, Euro } from 'lucide-react';

interface QuizFundCardProps {
  fund: Fund;
  onGetInTouch: (fund: Fund) => void;
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `€${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `€${(value / 1000).toFixed(0)}K`;
  }
  return `€${value.toLocaleString()}`;
};

export const QuizFundCard: React.FC<QuizFundCardProps> = ({ fund, onGetInTouch }) => {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-lg text-foreground truncate">
                {fund.name}
              </h4>
              {fund.isVerified && (
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {fund.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                by {fund.managerName}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {fund.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Euro className="h-3.5 w-3.5" />
              <span className="text-xs">Min. Investment</span>
            </div>
            <p className="font-semibold text-sm">
              {formatCurrency(fund.minimumInvestment)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs">Target Return</span>
            </div>
            <p className="font-semibold text-sm">
              {fund.returnTarget || 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">Lock-up</span>
            </div>
            <p className="font-semibold text-sm">
              {fund.term ? `${fund.term} years` : 'Flexible'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => onGetInTouch(fund)}
            className="flex-1 gap-2"
          >
            <Mail className="h-4 w-4" />
            Get in Touch
          </Button>
          <Button 
            variant="outline"
            size="sm"
            asChild
            className="gap-1"
          >
            <a href={`/${fund.id}`} target="_blank" rel="noopener noreferrer">
              View Details
              <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};
