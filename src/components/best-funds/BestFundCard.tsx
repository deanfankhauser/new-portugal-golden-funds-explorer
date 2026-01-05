import React from 'react';
import { Link } from 'react-router-dom';
import { ScoredFund } from '@/utils/fundScoring';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { formatManagementFee, formatPerformanceFee } from '@/utils/feeFormatters';
import { GitCompare, ChevronRight, Info } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import VerificationTooltip from '@/components/common/VerificationTooltip';

interface BestFundCardProps {
  scoredFund: ScoredFund;
  rank?: number;
}

const BestFundCard: React.FC<BestFundCardProps> = ({ scoredFund, rank }) => {
  const { fund, whyIncluded } = scoredFund;
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };
  
  // Format lock-up display
  const getLockupDisplay = () => {
    if (fund.term) {
      return `${fund.term}-year term`;
    }
    return fund.redemptionTerms?.frequency || 'End of term';
  };
  
  return (
    <Card className="border border-border/60 rounded-xl bg-card hover:shadow-md transition-shadow duration-200 group">
      <CardContent className="p-6">
        {/* Header with logo and name */}
        <div className="flex items-start gap-3 mb-4">
          <CompanyLogo managerName={fund.managerName} size="sm" className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {rank && (
                <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                  #{rank}
                </span>
              )}
              {fund.isVerified && <VerificationTooltip isVerified={true} />}
            </div>
            <Link to={`/${fund.id}`} className="block group/link">
              <h3 className="text-lg font-semibold text-foreground group-hover/link:text-primary transition-colors line-clamp-2">
                {fund.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-0.5">{fund.managerName}</p>
          </div>
        </div>
        
        {/* Category badge */}
        <div className="mb-3">
          <Badge variant="outline" className="text-xs font-medium">
            {fund.category}
          </Badge>
        </div>
        
        {/* Key metrics - Fees & Liquidity */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
              Fees
            </span>
            <span className="text-sm font-mono font-semibold text-foreground">
              {formatManagementFee(fund.managementFee)} mgmt
            </span>
            {fund.performanceFee !== null && fund.performanceFee !== undefined && (
              <span className="text-xs text-muted-foreground ml-1">
                + {formatPerformanceFee(fund.performanceFee)} perf
              </span>
            )}
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
              Liquidity
            </span>
            <span className="text-sm font-semibold text-foreground">
              {getLockupDisplay()}
            </span>
          </div>
        </div>
        
        {/* Why it's here */}
        <div className="flex items-start gap-2 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 leading-snug">
            {whyIncluded}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to={`/${fund.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCompareClick}
                className={`h-9 w-9 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <GitCompare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isSelected ? 'Remove from comparison' : 'Add to comparison'}
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
};

export default BestFundCard;
