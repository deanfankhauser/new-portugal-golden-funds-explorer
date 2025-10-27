
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { isFundGVEligible } from '../data/services/gv-eligibility-service';
import { getFundType } from '../utils/fundTypeUtils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitCompare, PieChart, Globe, Tag, User, Euro, CheckCircle2 } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import IntroductionButton from './fund-details/IntroductionButton';
import { formatPercentage } from './fund-details/utils/formatters';
import { tagToSlug, categoryToSlug, managerToSlug } from '@/lib/utils';
import DataFreshnessIndicator from './common/DataFreshnessIndicator';
import { getReturnTargetDisplay } from '../utils/returnTarget';
import { DateManagementService } from '../services/dateManagementService';

import { DATA_AS_OF_LABEL } from '../utils/constants';
import { SaveFundButton } from './common/SaveFundButton';

interface FundListItemProps {
  fund: Fund;
}

const FundListItem: React.FC<FundListItemProps> = ({ fund }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  
  const isSelected = isInComparison(fund.id);
  const isGVEligible = isFundGVEligible(fund);
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to fund details
    
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  // Get the main geographic allocation (first one)
  const mainGeoAllocation = fund.geographicAllocation && fund.geographicAllocation.length > 0 
    ? fund.geographicAllocation[0] 
    : null;

  const getVerificationBadge = () => {
    // Priority: Admin verification (manual)
    if (fund.isVerified) {
      return (
        <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg border-2 border-green-700 ring-2 ring-green-400/50 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span>VERIFIED</span>
        </div>
      );
    }
    
    // Explicitly show unverified status
    return (
      <Badge variant="outline" className="text-xs font-medium">
        UNVERIFIED
      </Badge>
    );
  };

  return (
    <Card className={`border rounded-xl hover:shadow-lg transition-all duration-200 bg-card w-full group relative ${
      fund.isVerified 
        ? 'ring-2 ring-green-500/20 bg-green-50/30 border-green-200' 
        : ''
    }`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
              <Link to={`/${fund.id}`} className="block" onClick={() => window.scrollTo(0, 0)}>
                {fund.name}
              </Link>
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {getVerificationBadge()}
              {isGVEligible && (
                <Badge variant="default" className="text-xs font-medium">
                  GV Eligible
                </Badge>
              )}
              <Badge 
                variant={fund.fundStatus === 'Open' ? 'default' : fund.fundStatus === 'Closing Soon' ? 'destructive' : 'secondary'} 
                className="text-xs"
              >
                {fund.fundStatus}
              </Badge>
            </div>
          </div>
          <DataFreshnessIndicator fund={fund} variant="compact" />
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground mb-6 line-clamp-2">{fund.description}</p>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Minimum Investment */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground tracking-wide">MINIMUM INVESTMENT</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              €{fund.minimumInvestment?.toLocaleString() || 'Not specified'}
            </p>
          </div>
          
          {/* Target Return */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-4 rounded-xl border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-muted-foreground tracking-wide">TARGET ANNUAL RETURN</span>
            </div>
            <p className="text-2xl font-bold text-accent">
              {getReturnTargetDisplay(fund)}
            </p>
          </div>
        </div>

        {/* Structure & Redemption */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground tracking-wide mb-2">FUND STRUCTURE</h4>
            <div className="flex items-center gap-2">
              <Badge variant={getFundType(fund) === 'Closed-End' ? "outline" : "secondary"} className="font-medium">
                {getFundType(fund) === 'Open-Ended' ? "Open-ended" : "Closed-ended"}
              </Badge>
              {getFundType(fund) === 'Closed-End' && fund.term > 0 && (
                <span className="text-sm text-muted-foreground">({fund.term} years)</span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground tracking-wide mb-2">REDEMPTION TERMS</h4>
            {fund.redemptionTerms ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{fund.redemptionTerms.frequency}</span>
                  {!fund.redemptionTerms.redemptionOpen && (
                    <Badge variant="outline" className="text-xs">Closed</Badge>
                  )}
                </div>
                {fund.redemptionTerms.noticePeriod && fund.redemptionTerms.noticePeriod > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {fund.redemptionTerms.noticePeriod} days notice required
                  </p>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">End of term only</span>
            )}
          </div>
        </div>

        {/* Footer: Fees & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-border/50">
          {/* Fees */}
          <div className="text-sm text-muted-foreground">
            <span>Management: <strong className="text-foreground">{fund.managementFee}%</strong></span>
            <span className="mx-3">•</span>
            <span>Performance: <strong className="text-foreground">{fund.performanceFee}%</strong></span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <SaveFundButton fundId={fund.id} showText={false} size="sm" />
            <IntroductionButton variant="compact" />
            <Button 
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="font-medium"
              onClick={handleCompareClick}
            >
              <GitCompare className="mr-1.5 h-3.5 w-3.5" />
              {isSelected ? 'Added' : 'Compare'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundListItem;
