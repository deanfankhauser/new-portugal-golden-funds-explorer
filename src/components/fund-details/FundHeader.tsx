
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from "@/components/ui/button";
import { GitCompare, Calculator, CheckCircle2 } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { tagToSlug } from '@/lib/utils';
import IntroductionButton from './IntroductionButton';
import EnhancedGVEligibilityBadge from './EnhancedGVEligibilityBadge';
import RecentlyUpdatedBadge from './RecentlyUpdatedBadge';
import { getReturnTargetNumbers } from '../../utils/returnTarget';
import { CompanyLogo } from '../shared/CompanyLogo';

interface FundHeaderProps {
  fund: Fund;
}

const FundHeader: React.FC<FundHeaderProps> = ({ fund }) => {
  const navigate = useNavigate();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = () => {
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  const scrollToROICalculator = () => {
    const calculatorElement = document.getElementById('roi-calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Check if fund has return data for ROI calculator
  const { min, max } = getReturnTargetNumbers(fund);
  const hasReturnData = min != null || max != null;

  return (
    <>
      <div className="bg-gradient-to-r from-secondary to-muted p-4 md:p-8 lg:p-10 border-b border-border">
        <div className="flex flex-col gap-4 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <CompanyLogo managerName={fund.managerName} size="lg" className="mt-1" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight flex-1">
                  {fund.name} | Portugal Investment Fund
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {fund.isVerified && (
                  <Link to="/verification-program" className="inline-block hover:opacity-90 transition-opacity">
                    <div className="bg-success text-success-foreground px-6 py-3 rounded-full text-base font-bold flex items-center gap-2.5 shadow-xl border-2 border-success/80 ring-4 ring-success/30 animate-in fade-in zoom-in duration-500">
                      <CheckCircle2 className="w-6 h-6" />
                      <span>✓ VERIFIED FUND</span>
                    </div>
                  </Link>
                )}
                <EnhancedGVEligibilityBadge fund={fund} showDetails={false} />
                <RecentlyUpdatedBadge fund={fund} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Button 
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="w-full sm:w-auto"
                onClick={handleCompareClick}
              >
                <GitCompare className="mr-2 h-4 w-4" />
                {isSelected ? 'Added to Compare' : 'Compare'}
              </Button>
              <div className="w-full sm:w-auto">
                <IntroductionButton variant="compact" fundId={fund.id} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl leading-relaxed">{fund.description}</p>
        
        {/* Subtle ROI Calculator CTA - only show if fund has return data */}
        {hasReturnData && (
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium text-foreground text-sm mb-1">Calculate Your Portugal Golden Visa Investment Returns</h2>
                <p className="text-xs text-muted-foreground">
                  See projected ROI based on your investment amount and timeline
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={scrollToROICalculator}
                className="ml-4"
              >
                <Calculator className="w-4 h-4 mr-1" />
                Calculate ROI
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FundHeader;
