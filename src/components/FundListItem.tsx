import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { isFundGVEligible } from '../data/services/gv-eligibility-service';
import { getFundType } from '../utils/fundTypeUtils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Euro, CheckCircle2, GitCompare } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { formatPercentage } from './fund-details/utils/formatters';
import { tagToSlug, categoryToSlug, managerToSlug } from '@/lib/utils';
import DataFreshnessIndicator from './common/DataFreshnessIndicator';
import { getReturnTargetDisplay } from '../utils/returnTarget';

import { DATA_AS_OF_LABEL } from '../utils/constants';
import { SaveFundButton } from './common/SaveFundButton';
import { CompanyLogo } from './shared/CompanyLogo';

interface FundListItemProps {
  fund: Fund;
}

const FundListItem: React.FC<FundListItemProps> = ({ fund }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const isSelected = isInComparison(fund.id);
  const isGVEligible = isFundGVEligible(fund);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  return (
    <Card className="border border-border/60 rounded-xl bg-card w-full group">
      <CardContent className="p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-4 flex-1">
            <CompanyLogo managerName={fund.managerName} size="sm" className="mt-1" />
            <div className="flex-1">
              <Link to={`/${fund.id}`} className="block" onClick={() => window.scrollTo(0, 0)}>
                <h2 className="text-[28px] font-semibold text-foreground mb-3 tracking-tight">
                  {fund.name}
                </h2>
              </Link>
            <div className="flex items-center gap-2 flex-wrap">
              {fund.isVerified && (
                <Link to="/verification-program" onClick={(e) => e.stopPropagation()} className="hover:opacity-80 transition-opacity">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1 text-[13px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Verified
                  </Badge>
                </Link>
              )}
              {fund.isVerified && isGVEligible && (
                <Badge variant="outline" className="bg-primary/8 text-primary border-primary/20 px-3 py-1 text-[13px] font-medium">
                  GV Eligible
                </Badge>
              )}
              <Badge 
                variant="outline"
                className="bg-muted/40 text-muted-foreground border-border/50 px-2.5 py-0.5 text-[12px] font-medium"
              >
                {fund.fundStatus}
              </Badge>
            </div>
            </div>
          </div>
          <DataFreshnessIndicator fund={fund} variant="compact" />
        </div>
        
        {/* Description */}
        <p className="text-[16px] leading-relaxed text-muted-foreground mb-8 line-clamp-2 max-w-[90%]">
          {fund.description}
        </p>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          {/* Minimum Investment */}
          <div className="bg-muted/20 border border-border/40 rounded-[10px] p-6">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                Minimum Investment
              </span>
            </div>
            <p className="text-[24px] font-semibold text-foreground tracking-tight leading-none">
              €{fund.minimumInvestment?.toLocaleString() || '—'}
            </p>
          </div>
          
          {/* Target Return */}
          <div className="bg-muted/20 border border-border/40 rounded-[10px] p-6">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                Target Return
              </span>
            </div>
            <p className="text-[24px] font-semibold text-foreground tracking-tight leading-none">
              {getReturnTargetDisplay(fund)}
            </p>
          </div>
        </div>

        {/* Structure & Redemption */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border/60">
          <div className="flex flex-col gap-1">
            <h4 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-0">
              Fund Structure
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[16px] font-medium text-foreground">
                {getFundType(fund) === 'Open-Ended' ? 'Open-ended' : 'Closed-ended'}
              </span>
              {getFundType(fund) === 'Closed-End' && fund.term > 0 && (
                <span className="text-[14px] text-muted-foreground">({fund.term} years)</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <h4 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-0">
              Redemption Terms
            </h4>
            {fund.redemptionTerms ? (
              <div className="space-y-0.5 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-medium text-foreground">
                    {fund.redemptionTerms.frequency}
                  </span>
                  {!fund.redemptionTerms.redemptionOpen && (
                    <Badge variant="outline" className="text-[11px] px-2 py-0">Closed</Badge>
                  )}
                </div>
                {fund.redemptionTerms.noticePeriod && fund.redemptionTerms.noticePeriod > 0 && (
                  <p className="text-[14px] text-muted-foreground mt-0.5">
                    {fund.redemptionTerms.noticePeriod} days notice required
                  </p>
                )}
              </div>
            ) : (
              <span className="text-[16px] font-medium text-foreground mt-1">N/A</span>
            )}
          </div>
        </div>

        {/* Footer: Fees & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Fees */}
          <div className="flex items-center gap-6 text-[14px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span>Management:</span>
              <span className="font-medium text-foreground">{fund.managementFee != null ? `${fund.managementFee}%` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Performance:</span>
              <span className="font-medium text-foreground">{fund.performanceFee != null ? `${fund.performanceFee}%` : 'N/A'}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <SaveFundButton fundId={fund.id} showText={false} size="md" variant="outline" className="h-11 w-11" />
            <Button 
              variant="outline"
              size="icon"
              onClick={handleCompareClick}
              title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
              className={`h-11 w-11 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
            <Link to={`/${fund.id}`} onClick={() => window.scrollTo(0, 0)}>
              <Button 
                variant="default"
                size="default"
                className="font-medium bg-primary hover:bg-primary/90 h-11"
              >
                See more
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundListItem;
