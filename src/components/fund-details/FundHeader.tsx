
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from "@/components/ui/button";
import { GitCompare, Calculator } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useAuth } from '../../contexts/AuthContext';
import { tagToSlug } from '@/lib/utils';
import IntroductionButton from './IntroductionButton';
import LazyPasswordDialog from '../common/LazyPasswordDialog';

interface FundHeaderProps {
  fund: Fund;
}

const FundHeader: React.FC<FundHeaderProps> = ({ fund }) => {
  const navigate = useNavigate();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = () => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    
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
      
      // If not authenticated, open password dialog after scroll
      if (!isAuthenticated) {
        setTimeout(() => {
          setShowPasswordDialog(true);
        }, 800);
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 md:p-8 lg:p-10 border-b border-gray-100">
        <div className="flex flex-col gap-4 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-800 tracking-tight leading-tight">{fund.name} | Portugal Golden Visa Investment Fund</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Button 
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`${isSelected ? 
                  "bg-[#EF4444] text-white hover:bg-[#EF4444]/90 shadow-sm" : 
                  "border-[#EF4444] text-[#EF4444] hover:bg-[#f0f0f0] hover:text-[#EF4444] shadow-sm"} w-full sm:w-auto`}
                onClick={handleCompareClick}
              >
                <GitCompare className="mr-2 h-4 w-4" />
                {isSelected ? 'Added to Compare' : 'Compare'}
              </Button>
              <div className="w-full sm:w-auto">
                <IntroductionButton variant="compact" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8 max-w-3xl leading-relaxed">{fund.description}</p>
        
        {/* Subtle ROI Calculator CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-blue-900 text-sm mb-1">Calculate Your Portugal Golden Visa Investment Returns</h2>
              <p className="text-xs text-blue-700">
                See projected ROI based on your investment amount and timeline
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={scrollToROICalculator}
              className="border-blue-300 text-blue-600 hover:bg-blue-50 ml-4"
            >
              <Calculator className="w-4 h-4 mr-1" />
              Calculate ROI
            </Button>
          </div>
        </div>
      </div>

      <LazyPasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundHeader;
