import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fund } from '@/data/types/funds';
import { USEligibilityBadge, USEligibilityStatus } from './USEligibilityBadge';
import { formatCurrencyValue } from '@/utils/currencyFormatters';
import { useComparison } from '@/contexts/ComparisonContext';
import { useShortlist } from '@/contexts/ShortlistContext';

interface USFundCardProps {
  fund: Fund;
  usStatus: USEligibilityStatus;
  sourceUrl?: string;
}

export const USFundCard: React.FC<USFundCardProps> = ({
  fund,
  usStatus,
  sourceUrl
}) => {
  const { addToComparison, isInComparison, compareFunds } = useComparison();
  const { addToShortlist, isInShortlist } = useShortlist();
  
  const isComparing = isInComparison(fund.id);
  const isShortlisted = isInShortlist(fund.id);
  const canAddToComparison = compareFunds.length < 3;

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isComparing && canAddToComparison) {
      addToComparison(fund);
    }
  };

  const handleShortlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isShortlisted) {
      addToShortlist(fund);
    }
  };

  // Format fee display
  const feeDisplay = fund.managementFee !== null && fund.managementFee !== undefined
    ? `${fund.managementFee}% mgmt`
    : 'Fee N/A';
  
  const perfFeeDisplay = fund.performanceFee !== null && fund.performanceFee !== undefined
    ? ` + ${fund.performanceFee}% perf`
    : '';

  // Format lock-up display
  const lockUpDisplay = fund.term ? `${fund.term}yr lock-up` : 'Lock-up N/A';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/60 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link 
              to={`/${fund.id}`}
              className="block hover:text-primary transition-colors"
            >
              <h3 className="font-semibold text-foreground text-lg leading-tight truncate">
                {fund.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {fund.managerName}
            </p>
          </div>
          
          <USEligibilityBadge 
            status={usStatus} 
            sourceUrl={sourceUrl}
            compact
          />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Key metrics row */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {fund.category}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {feeDisplay}{perfFeeDisplay}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {lockUpDisplay}
          </Badge>
        </div>
        
        {/* Minimum investment */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Minimum:</span>
          <span className="font-medium text-foreground">
            {fund.minimumInvestment 
              ? formatCurrencyValue(fund.minimumInvestment)
              : 'N/A'}
          </span>
        </div>
        
        {/* Target return with disclaimer */}
        {fund.returnTarget && fund.returnTarget !== 'N/A' && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground">Target:</span>
            <div className="flex-1">
              <span className="font-medium text-foreground">{fund.returnTarget}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Info className="h-3 w-3 text-muted-foreground/70" />
                <span className="text-xs text-muted-foreground/70">
                  Manager-stated, not guaranteed
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Source link if available */}
        {sourceUrl && (
          <a 
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View eligibility source
          </a>
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            asChild 
            variant="default" 
            size="sm" 
            className="flex-1"
          >
            <Link to={`/${fund.id}`}>View Details</Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCompare}
            disabled={isComparing || !canAddToComparison}
            className="shrink-0"
          >
            {isComparing ? 'Added' : 'Compare'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default USFundCard;
