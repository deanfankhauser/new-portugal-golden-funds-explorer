
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/types/funds';
import { isFundGVEligible } from '../data/services/gv-eligibility-service';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitCompare, User, Euro, CheckCircle2 } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { managerToSlug } from '../lib/utils';
import { getReturnTargetDisplay } from '../utils/returnTarget';
import { CompanyLogo } from './shared/CompanyLogo';
import { formatManagementFee, formatPerformanceFee } from '../utils/feeFormatters';
import { formatFundSize } from '../utils/fundSizeFormatters';
import { calculateRiskBand, getRiskBandLabel, getRiskBandColor, getRiskBandBgColor } from '../utils/riskCalculation';

interface FundCardProps {
  fund: Fund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  
  const isSelected = isInComparison(fund.id);
  const isGVEligible = isFundGVEligible(fund);
  const riskBand = calculateRiskBand(fund);
  const riskBandLabel = getRiskBandLabel(riskBand);
  const riskBandBgColor = getRiskBandBgColor(riskBand);
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking on the button
    
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
          <span className="text-sm font-semibold text-foreground">{returnDisplay}</span>
        </>
      );
    }
    
    if (fund.term && fund.term > 0) {
      return (
        <>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
            Lock-up Period
          </span>
          <span className="text-sm font-semibold text-foreground">{fund.term} years</span>
        </>
      );
    }
    
    return (
      <>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
          Risk Profile
        </span>
        <span className="text-sm font-semibold text-foreground">{riskBandLabel}</span>
      </>
    );
  };

  return (
    <>
      <Card className={`group h-full bg-card rounded-xl border border-border p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300 ${
        fund.isVerified 
          ? 'ring-2 ring-success/30 border-success/30' 
          : ''
      }`}>
        <CardHeader className="p-0 pb-4">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl">
                <Link to={`/${fund.id}`} className="hover:text-primary transition-colors block" onClick={() => window.scrollTo(0, 0)}>
                  {fund.name}
                </Link>
              </CardTitle>
              {fund.isVerified ? (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Link to="/verification-program" onClick={(e) => e.stopPropagation()} className="inline-block hover:opacity-80 transition-opacity">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1 text-[13px] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Verified
                    </Badge>
                  </Link>
                  {isGVEligible && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 text-[13px] font-medium">
                      GV Eligible
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">UNVERIFIED</Badge>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Strategy Tag */}
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 mb-2 block">
            {fund.category}
          </span>

          {/* Description */}
          <div className="text-[14px] leading-relaxed text-muted-foreground mb-4 line-clamp-2">
            {fund.description}
          </div>

          {/* Key Metrics Row - 3 Equal Columns */}
          <div className="grid grid-cols-3 divide-x divide-border/40 border border-border/40 rounded-lg bg-muted/10 mb-4">
            {/* Column 1: Minimum Investment */}
            <div className="p-3 text-center">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                Min. Investment
              </span>
              <span className="text-sm font-semibold text-foreground">
                €{fund.minimumInvestment?.toLocaleString() || '—'}
              </span>
            </div>
            
            {/* Column 2: Dynamic - Target Return OR Lock-up OR Risk */}
            <div className="p-3 text-center">
              {getMiddleColumnContent()}
            </div>
            
            {/* Column 3: Redemption Terms */}
            <div className="p-3 text-center">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                Redemption
              </span>
              <span className="text-sm font-semibold text-foreground">
                {fund.redemptionTerms?.frequency || 'End of Term'}
              </span>
            </div>
          </div>

          {/* Fees - Cleaner format */}
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-4 px-2">
            <span className="font-medium">Fees:</span>
            <span>
              <span className="font-semibold text-foreground">{formatManagementFee(fund.managementFee)}</span>
              <span className="mx-1">Mgmt</span>
              <span className="text-muted-foreground/60">·</span>
              <span className="ml-1 font-semibold text-foreground">{formatPerformanceFee(fund.performanceFee)}</span>
              <span className="mx-1">Perf</span>
            </span>
          </div>

          {/* Fund Manager Section */}
          <div className="flex items-center gap-2 mb-4 bg-secondary p-2 rounded-md">
            <CompanyLogo managerName={fund.managerName} size="xs" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Fund Manager</p>
              <Link 
                to={`/manager/${managerToSlug(fund.managerName)}`}
                className="font-medium hover:text-accent transition-colors"
              >
                {fund.managerName}
              </Link>
            </div>
          </div>


          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className={`${
                isSelected 
                  ? 'bg-primary text-primary-foreground' 
                  : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
              onClick={handleCompareClick}
            >
              <GitCompare className="mr-1 h-3 w-3" />
              {isSelected ? 'Added to Compare' : 'Compare'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FundCard;
