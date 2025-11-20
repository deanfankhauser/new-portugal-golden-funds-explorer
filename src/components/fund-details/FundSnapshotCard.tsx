import React, { useEffect, useState } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Banknote, Calendar, Globe, Lock, TrendingUp, Shield, Award, MessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { InvestmentFundStructuredDataService } from '../../services/investmentFundStructuredDataService';
import { getFundType } from '../../utils/fundTypeUtils';
import FundSizeFormatter from './FundSizeFormatter';
import { getReturnTargetDisplay, getReturnTargetNumbers } from '../../utils/returnTarget';
import PerformancePreview from './PerformancePreview';
import KeyFactsChips from './KeyFactsChips';
import AuthGate from '../auth/AuthGate';
import { formatManagementFee, formatPerformanceFee } from '../../utils/feeFormatters';

interface FundSnapshotCardProps {
  fund: Fund;
}

const scrollToEnquiry = () => {
  const element = document.getElementById('enquiry-form');
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      const firstInput = element.querySelector('input');
      firstInput?.focus();
    }, 500);
  }
};

const FundSnapshotCard: React.FC<FundSnapshotCardProps> = ({ fund }) => {
  
  // Enhanced hurdle rate calculation with priority
  const getHurdleRate = (fund: Fund): string => {
    // 1. Explicit hurdle rate (highest priority)
    if (fund.hurdleRate != null) return `${fund.hurdleRate}%`;
    
    // 2. Derive from target return (current behavior)
    const { min } = getReturnTargetNumbers(fund);
    if (min != null) return `${min}%`;
    
    // 3. Default fallback
    return "N/A";
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
    return "N/A";
  };

  // Helper function to get subscription deadline
  const getSubscriptionDeadline = () => {
    // Look for subscription-related information in fund details
    const hasDeadline = fund.detailedDescription?.toLowerCase().includes('deadline') ||
                       fund.detailedDescription?.toLowerCase().includes('closing');
    return hasDeadline ? 'Contact for details' : 'Open';
  };

  const usEligible = getUSEligibility();

  // Get fund size from AUM in historicalPerformance
  const getFundSize = (): string => {
    if (!fund.historicalPerformance) return 'N/A';
    
    const years = Object.keys(fund.historicalPerformance).sort((a, b) => parseInt(b) - parseInt(a));
    if (years.length > 0) {
      const latestYear = years[0];
      const aum = fund.historicalPerformance[latestYear]?.aum;
      if (aum !== undefined && aum !== null) {
        // If AUM is already in millions (< 1000), use it directly
        // If AUM is in actual euros (>= 1000), convert to millions
        if (aum >= 1000) {
          const aumInMillions = aum / 1000000;
          return `€${aumInMillions.toFixed(0)}M`;
        }
        return `€${aum.toFixed(0)}M`;
      }
    }
    
    // Fallback to fund.fundSize if available
    if (fund.fundSize) {
      if (fund.fundSize >= 1000) {
        return `€${(fund.fundSize / 1000000).toFixed(0)}M`;
      }
      return `€${fund.fundSize.toFixed(0)}M`;
    }
    
    return 'N/A';
  };

  return (
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-6 lg:p-10">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-8">Fund Snapshot</h2>

        {/* Get in Touch Button - Mobile/Tablet Only */}
        <Button 
          onClick={scrollToEnquiry}
          className="w-full gap-2 shadow-lg lg:hidden mb-6 h-12"
          size="lg"
        >
          <MessageSquare className="h-5 w-5" />
          Get in Touch
        </Button>

        {/* Performance Section */}
        <PerformancePreview fund={fund} />

        {/* Key Facts Section */}
        <div className="mb-8 pb-8 border-b border-border/60">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">Key Facts</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Banknote className="h-[18px] w-[18px] text-muted-foreground" />
                Min Investment
              </span>
              <span className="text-[15px] font-semibold text-foreground">{formatCurrency(fund.minimumInvestment)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Calendar className="h-[18px] w-[18px] text-muted-foreground" />
                Redemptions
              </span>
              <span className="text-[15px] font-semibold text-foreground">{fund.redemptionTerms?.frequency || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Globe className="h-[18px] w-[18px] text-muted-foreground" />
                Open to US
              </span>
              <span className="text-[15px] font-semibold text-foreground">{usEligible ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Lock className="h-[18px] w-[18px] text-muted-foreground" />
                Lock-up
              </span>
              <span className="text-[15px] font-semibold text-foreground">{getLockUpPeriod()}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <TrendingUp className="h-[18px] w-[18px] text-muted-foreground" />
                Fund Size (AUM)
              </span>
              <span className="text-[15px] font-semibold text-foreground">{getFundSize()}</span>
            </div>
          </div>
        </div>

        {/* Fees Section */}
        <AuthGate 
          message="Sign in to view complete fee structure and additional details"
          height="200px"
        >
          <div className="mb-8 pb-8 border-b border-border/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex flex-col gap-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Management Fee</div>
                <div className="text-[28px] font-bold text-primary tracking-tight">
                  {formatManagementFee(fund.managementFee)}
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex flex-col gap-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Performance Fee</div>
                <div className="text-[28px] font-bold text-primary tracking-tight">
                  {formatPerformanceFee(fund.performanceFee)}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mb-8 pb-8 border-b border-border/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">Additional Details</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                  <Calendar className="h-[18px] w-[18px] text-muted-foreground" />
                  NAV Frequency
                </span>
                <span className="text-[15px] font-semibold text-foreground">{fund.navFrequency || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                  <Calendar className="h-[18px] w-[18px] text-muted-foreground" />
                  Established
                </span>
                <span className="text-[15px] font-semibold text-foreground">{fund.established || 'N/A'}</span>
              </div>
              {fund.cmvmId && (
                <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                    <Shield className="h-[18px] w-[18px] text-muted-foreground" />
                    CMVM ID
                  </span>
                  <span className="text-[15px] font-semibold text-foreground">{fund.cmvmId}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                  <Calendar className="h-[18px] w-[18px] text-muted-foreground" />
                  Notice Period
                </span>
                <span className="text-[15px] font-semibold text-foreground">
                  {fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod} days` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                  <Shield className="h-[18px] w-[18px] text-muted-foreground" />
                  Regulated By
                </span>
                <span className="text-[15px] font-semibold text-foreground">{fund.regulatedBy || 'N/A'}</span>
              </div>
            </div>
          </div>
        </AuthGate>

        {/* Compliance Section */}
        <div className="mb-8 pb-8 border-b border-border/60">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">Compliance</h3>
          <TooltipProvider>
            <div className="flex flex-wrap gap-3">
              {fund.cmvmId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg text-[13px] font-semibold text-primary">
                      <Shield className="h-4 w-4" />
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
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-warning/10 border border-warning/20 rounded-lg text-[13px] font-semibold text-warning">
                      <Award className="h-4 w-4" />
                      GV Eligible
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Qualifies for Portugal Golden Visa</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {fund.tags?.includes('UCITS') && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 border border-accent/20 rounded-lg text-[13px] font-semibold text-accent">
                      <Shield className="h-4 w-4" />
                      UCITS
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">EU-regulated investment fund</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>

        {/* Disclaimer */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          Capital at risk. Past performance isn't indicative of future returns. This is not investment advice.
        </p>
      </CardContent>
    </Card>
  );
};

export default FundSnapshotCard;