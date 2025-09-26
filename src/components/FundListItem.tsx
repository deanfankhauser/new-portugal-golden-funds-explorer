
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { isFundGVEligible } from '../data/services/gv-eligibility-service';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitCompare, PieChart, Globe, Tag, User, Euro } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import IntroductionButton from './fund-details/IntroductionButton';
import { formatPercentage } from './fund-details/utils/formatters';
import { tagToSlug, categoryToSlug, managerToSlug } from '@/lib/utils';
import DataFreshnessIndicator from './common/DataFreshnessIndicator';

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

  return (
    <>
      <Card className="border rounded-lg hover:border-accent transition-colors bg-card shadow-sm w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 mr-2 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                      <Link to={`/${fund.id}`} className="hover:text-primary transition-colors block" onClick={() => window.scrollTo(0, 0)}>
                        {fund.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="default" 
                        className="text-xs"
                      >
                        GV Eligible
                      </Badge>
                    </div>
                  </div>
                </div>
                <DataFreshnessIndicator fund={fund} variant="compact" />
              </div>
              
              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm sm:text-base">{fund.description}</p>
              
              {/* Key Investment Metrics - Most Important */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center mb-1">
                    <Euro className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-xs text-muted-foreground font-medium">MINIMUM INVESTMENT</span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    €{fund.minimumInvestment?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                
                <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                  <div className="flex items-center mb-1">
                    <PieChart className="w-4 h-4 mr-2 text-accent" />
                    <span className="text-xs text-muted-foreground font-medium">TARGET RETURN</span>
                  </div>
                  <p className="text-lg font-bold text-accent">
                    {fund.returnTarget}
                  </p>
                </div>
              </div>

              {/* Fund Structure & Liquidity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">FUND STRUCTURE</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={fund.term > 0 ? "secondary" : "default"} className="text-xs">
                      {fund.term > 0 ? "Closed-ended" : "Open-ended"}
                    </Badge>
                    {fund.term > 0 && (
                      <span className="text-sm text-muted-foreground">({fund.term} years)</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1">REDEMPTION TERMS</p>
                  <div className="text-sm">
                    {fund.redemptionTerms ? (
                      <div className="space-y-1">
                        <p className="font-medium">
                          {fund.redemptionTerms.frequency}
                          {!fund.redemptionTerms.redemptionOpen && (
                            <span className="text-destructive ml-1">(Closed)</span>
                          )}
                        </p>
                        {fund.redemptionTerms.noticePeriod && (
                          <p className="text-muted-foreground text-xs">
                            {fund.redemptionTerms.noticePeriod} days notice
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">End of term</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Fees Summary - Compact */}
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Management: {fund.managementFee}%</span>
                  <span className="text-muted-foreground">Performance: {fund.performanceFee}%</span>
                </div>
              </div>
              
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 justify-center lg:min-w-[160px]">
              <SaveFundButton fundId={fund.id} showText size="sm" />
              <IntroductionButton variant="compact" />
              
              <Button 
                variant="outline" 
                size="sm"
                className={`text-xs sm:text-sm ${
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
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FundListItem;
