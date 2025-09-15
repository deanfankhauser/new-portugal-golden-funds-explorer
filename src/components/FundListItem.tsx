
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
import EligibilityBasisDisplayLine from './fund-details/EligibilityBasisDisplayLine';
import { DATA_AS_OF_LABEL } from '../utils/constants';

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
                <div className="flex-1 mr-2">
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
                <DataFreshnessIndicator fund={fund} variant="compact" />
              </div>
              
              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm sm:text-base">{fund.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center min-w-0">
                  <Tag className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Category</p>
                    <p className="font-medium text-sm sm:text-base truncate">
                      <Link to={`/categories/${categoryToSlug(fund.category)}`} className="hover:text-primary transition-colors">
                        {fund.category}
                      </Link>
                    </p>
                  </div>
                </div>
                
                {mainGeoAllocation && (
                  <div className="flex items-center min-w-0">
                    <Globe className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Main Region</p>
                      <p className="font-medium text-sm sm:text-base truncate">
                        {mainGeoAllocation.region} ({formatPercentage(mainGeoAllocation.percentage)})
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center min-w-0">
                  <PieChart className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Target Return</p>
                    <p className="font-medium text-sm sm:text-base truncate">
                      {fund.returnTarget} <span className="text-xs text-muted-foreground">{DATA_AS_OF_LABEL}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center min-w-0">
                  <User className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Fund Manager</p>
                    <Link 
                      to={`/manager/${managerToSlug(fund.managerName)}`} 
                      className="font-medium hover:text-primary transition-colors text-sm sm:text-base block truncate"
                      title={fund.managerName}
                    >
                      {fund.managerName}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Euro className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Mgmt Fee:</span>
                  </div>
                  <span className="font-medium text-sm">
                    {fund.managementFee}% <span className="text-xs text-muted-foreground">{DATA_AS_OF_LABEL}</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Euro className="w-4 h-4 mr-2 text-accent" />
                    <span className="text-sm text-muted-foreground">Perf Fee:</span>
                  </div>
                  <span className="font-medium text-sm">
                    {fund.performanceFee}% <span className="text-xs text-muted-foreground">{DATA_AS_OF_LABEL}</span>
                  </span>
                </div>
              </div>
              
              {/* Eligibility basis line - always show */}
              <div className="mt-2">
                <EligibilityBasisDisplayLine fund={fund} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 justify-center lg:min-w-[160px]">
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
