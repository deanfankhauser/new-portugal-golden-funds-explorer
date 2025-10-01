import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, Calendar, Globe, Lock, TrendingUp, Shield, Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { InvestmentFundStructuredDataService } from '../../services/investmentFundStructuredDataService';
import { getFundType } from '../../utils/fundTypeUtils';
import FundSizeFormatter from './FundSizeFormatter';
import { getReturnTargetDisplay, getReturnTargetNumbers } from '../../utils/returnTarget';
import PerformancePreview from './PerformancePreview';
import KeyFactsChips from './KeyFactsChips';

interface FundSnapshotCardProps {
  fund: Fund;
}

const FundSnapshotCard: React.FC<FundSnapshotCardProps> = ({ fund }) => {
  // Enhanced hurdle rate calculation with priority
  const getHurdleRate = (fund: Fund): string => {
    // 1. Explicit hurdle rate (highest priority)
    if (fund.hurdleRate != null) return `${fund.hurdleRate}%`;
    
    // 2. Derive from target return (current behavior)
    const { min } = getReturnTargetNumbers(fund);
    if (min != null) return `${min}%`;
    
    // 3. Default fallback
    return "8%";
  };

  // Helper function to format currency amounts
  const formatCurrency = (amount: number | undefined | null, currency: string = 'EUR'): string => {
    if (!amount || amount === 0) return 'Contact for details';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(amount);
  };

  // Add structured data for fund snapshot
  useEffect(() => {
    const fundSchema = InvestmentFundStructuredDataService.generateInvestmentFundSchema(fund);
    
    // Remove existing fund schema
    const existingFundSchema = document.querySelector('script[data-schema="fund-snapshot"]');
    if (existingFundSchema) {
      existingFundSchema.remove();
    }
    
    // Add new fund schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'fund-snapshot');
    script.textContent = JSON.stringify(fundSchema);
    document.head.appendChild(script);
    
    return () => {
      const schemaScript = document.querySelector('script[data-schema="fund-snapshot"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [fund]);
  // Helper function to extract CMVM license number
  const getCMVMLicense = () => {
    const cmvmMatch = fund.cmvmId?.match(/\d+/);
    return cmvmMatch ? cmvmMatch[0] : 'Not available';
  };


  // Helper function to check US citizen eligibility
  const getUSEligibility = () => {
    // Check if fund explicitly mentions US restrictions
    const hasUSRestriction = fund.tags?.some(tag => 
      tag.toLowerCase().includes('us') && tag.toLowerCase().includes('restrict')
    ) || fund.detailedDescription?.toLowerCase().includes('us persons');
    
    return !hasUSRestriction;
  };

  // Helper function to determine if fund is open-ended
  const isOpenEnded = () => {
    // Use centralized fund type logic that prioritizes tags
    return getFundType(fund) === 'Open-Ended';
  };

  // Helper function to get fund type
  const getFundTypeDisplay = () => {
    return getFundType(fund);
  };

  // Helper function to get fund lifetime
  const getFundLifetime = () => {
    if (fund.term) {
      const termStr = String(fund.term);
      // Convert term to years if it's in months or other format
      if (termStr.toLowerCase().includes('month')) {
        const months = parseInt(termStr);
        return `${Math.round(months / 12)} years`;
      }
      if (termStr.toLowerCase().includes('year')) {
        return termStr;
      }
      return termStr;
    }
    return 'Open-ended';
  };

  // Helper function to get lock-up period
  const getLockUpPeriod = () => {
    if (fund.redemptionTerms?.minimumHoldingPeriod !== undefined) {
      return fund.redemptionTerms.minimumHoldingPeriod === 0 ? 
        'No Lock-up' : 
        `${fund.redemptionTerms.minimumHoldingPeriod} months`;
    }
    // Fallback to term-based calculation
    return fund.term ? `${fund.term * 12} months` : 'No Lock-up';
  };

  // Helper function to get redemption status
  const getRedemptionStatus = () => {
    if (fund.redemptionTerms?.frequency) {
      return fund.redemptionTerms.frequency;
    }
    return isOpenEnded() ? 'Available' : 'Restricted';
  };

  // Helper function to get subscription deadline
  const getSubscriptionDeadline = () => {
    // Look for subscription-related information in fund details
    const hasDeadline = fund.detailedDescription?.toLowerCase().includes('deadline') ||
                       fund.detailedDescription?.toLowerCase().includes('closing');
    return hasDeadline ? 'Contact for details' : 'Open';
  };

  const usEligible = getUSEligibility();

  const formatFundSize = (size: number | undefined): string => {
    if (!size) return 'N/A';
    if (size >= 1) {
      return `€${size.toFixed(1)}m`;
    }
    return `€${(size * 1000).toFixed(0)}k`;
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl">Fund Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Preview */}
        <div className="pb-6 border-b">
          <PerformancePreview fund={fund} />
        </div>

        {/* Key Facts */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Key Facts</h3>
          <KeyFactsChips fund={fund} />
        </div>

        {/* Trust Badges */}
        <div className="pt-6 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Compliance</h3>
          <TooltipProvider>
            <div className="flex flex-wrap gap-2">
              {fund.tags?.includes('UCITS') && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-md text-xs font-medium">
                      <Shield className="h-3.5 w-3.5" />
                      UCITS
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">EU-regulated investment fund</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {fund.cmvmId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-md text-xs font-medium">
                      <Award className="h-3.5 w-3.5" />
                      CMVM #{fund.cmvmId}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Portuguese securities regulator ID</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {fund.tags?.includes('Golden Visa Eligible') && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-warning/10 text-warning rounded-md text-xs font-medium">
                      <Award className="h-3.5 w-3.5" />
                      GV Eligible
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Qualifies for Portugal Golden Visa</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground pt-4 border-t">
          Capital at risk. Past performance isn't indicative of future returns.
        </p>
      </CardContent>
    </Card>
  );
};

export default FundSnapshotCard;