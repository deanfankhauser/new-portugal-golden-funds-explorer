import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/types/funds';
import { isFundGVEligible } from '../data/services/gv-eligibility-service';
import { getFundType } from '../utils/fundTypeUtils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Euro, CheckCircle2, GitCompare } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { formatPercentage } from './fund-details/utils/formatters';
import { tagToSlug, categoryToSlug, managerToSlug } from '@/lib/utils';
import { getReturnTargetDisplay } from '../utils/returnTarget';
import { DATA_AS_OF_LABEL } from '../utils/constants';
import { SaveFundButton } from './common/SaveFundButton';
import { CompanyLogo } from './shared/CompanyLogo';
import { formatManagementFee, formatPerformanceFee } from '../utils/feeFormatters';
import { calculateRiskBand, getRiskBandLabel, getRiskBandBgColor } from '../utils/riskCalculation';

interface FundListItemProps {
  fund: Fund;
}

const FundListItem: React.FC<FundListItemProps> = ({ fund }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const isSelected = isInComparison(fund.id);
  const isGVEligible = isFundGVEligible(fund);
  const riskBand = calculateRiskBand(fund);
  const riskBandLabel = getRiskBandLabel(riskBand);
  const riskBandBgColor = getRiskBandBgColor(riskBand);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  // Smart middle column logic: Target Return > Lock-up Period > Risk Profile
  const getMiddleColumnContent = () => {
    const returnDisplay = getReturnTargetDisplay(fund);
    if (returnDisplay !== 'Not disclosed') {
      return (
        <>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
            Target Return
          </span>
          <span className="text-lg font-semibold text-foreground">{returnDisplay}</span>
        </>
      );
    }
    
    if (fund.term && fund.term > 0) {
      return (
        <>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
            Lock-up Period
          </span>
          <span className="text-lg font-semibold text-foreground">{fund.term} years</span>
        </>
      );
    }
    
    return (
      <>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
          Risk Profile
        </span>
        <span className="text-lg font-semibold text-foreground">{riskBandLabel}</span>
      </>
    );
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
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 text-[13px] font-medium">
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
        </div>
        
        {/* Strategy Tag */}
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 mb-2 block">
          {fund.category}
        </span>

        {/* Description */}
        <p className="text-[14px] leading-relaxed text-muted-foreground mb-6 line-clamp-2 max-w-[85%]">
          {fund.description}
        </p>
        
        {/* Key Metrics Row - 3 Equal Columns */}
        <div className="grid grid-cols-3 divide-x divide-border/40 border border-border/40 rounded-lg bg-muted/10 mb-6">
          {/* Column 1: Minimum Investment */}
          <div className="p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
              Min. Investment
            </span>
            <span className="text-lg font-semibold text-foreground">
              €{fund.minimumInvestment?.toLocaleString() || '—'}
            </span>
          </div>
          
          {/* Column 2: Dynamic - Target Return OR Lock-up OR Risk */}
          <div className="p-4 text-center">
            {getMiddleColumnContent()}
          </div>
          
          {/* Column 3: Redemption Terms */}
          <div className="p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
              Redemption
            </span>
            <span className="text-lg font-semibold text-foreground">
              {fund.redemptionTerms?.frequency || 'End of Term'}
            </span>
          </div>
        </div>

        {/* Footer: Fees & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Fees - Cleaner format */}
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <span className="font-medium">Fees:</span>
            <span>
              <span className="font-semibold text-foreground">{formatManagementFee(fund.managementFee)}</span>
              <span className="mx-1">Mgmt</span>
              <span className="text-muted-foreground/60">·</span>
              <span className="ml-1 font-semibold text-foreground">{formatPerformanceFee(fund.performanceFee)}</span>
              <span className="mx-1">Perf</span>
            </span>
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
                variant="secondary"
                size="default"
                className="font-medium h-11 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundListItem;
