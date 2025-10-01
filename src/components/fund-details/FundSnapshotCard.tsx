import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from 'lucide-react';
import { InvestmentFundStructuredDataService } from '../../services/investmentFundStructuredDataService';
import { getFundType } from '../../utils/fundTypeUtils';
import FundSizeFormatter from './FundSizeFormatter';
import { getReturnTargetDisplay, getReturnTargetNumbers } from '../../utils/returnTarget';

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

  const snapshotData = [
    {
      label: "Investment Sector",
      value: fund.category || "Alternative Investment"
    },
    {
      label: "Target Annual Return",
      value: getReturnTargetDisplay(fund)
    },
    {
      label: "Fund Size",
      value: <FundSizeFormatter fund={fund} />
    },
    {
      label: "Fund Type", 
      value: getFundTypeDisplay(),
      icon: isOpenEnded() ? <Check className="w-4 h-4 text-success" /> : undefined
    },
    {
      label: "Open to US Citizens",
      value: usEligible ? "Yes" : "No",
      icon: usEligible ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />
    },
    {
      label: "Minimum Investment",
      value: formatCurrency(fund.minimumInvestment, 'EUR')
    },
    {
      label: "Subscriptions",
      value: getSubscriptionDeadline()
    },
    {
      label: "Redemptions",
      value: getRedemptionStatus()
    },
    {
      label: "Notice Period",
      value: fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod} days` : (isOpenEnded() ? 'None' : '30 days')
    },
    {
      label: "Lock-up Period",
      value: getLockUpPeriod()
    },
    {
      label: "Fund Lifetime",
      value: getFundLifetime()
    },
    {
      label: "Fund Manager",
      value: fund.managerName || "Not specified"
    },
    {
      label: "Performance Fee Hurdle",
      value: getHurdleRate(fund)
    },
    {
      label: "CMVM License Number",
      value: getCMVMLicense()
    }
  ];

  // Helper function to determine US eligibility
  const determineUSEligibility = (fund: Fund): string => {
    const hasUSRestriction = fund.tags?.some(tag => 
      tag.toLowerCase().includes('us') && tag.toLowerCase().includes('restrict')
    );
    return !hasUSRestriction ? "Yes" : "No";
  };

  // Critical items to show above-the-fold
  const criticalItems = [
    {
      label: 'Min Investment',
      value: formatCurrency(fund.minimumInvestment),
      icon: '💰'
    },
    {
      label: 'Redemptions',
      value: fund.redemptionTerms?.frequency || 'N/A',
      icon: '📅'
    },
    {
      label: 'Open to US',
      value: determineUSEligibility(fund),
      icon: '🇺🇸'
    },
    {
      label: 'Lock-up',
      value: getLockUpPeriod(),
      icon: '🔒'
    },
    {
      label: 'Fund Size',
      value: fund.fundSize ? formatCurrency(fund.fundSize * 1000000) : 'N/A',
      icon: '📊'
    }
  ];

  // Additional items for collapsible section
  const additionalItems = [
    {
      label: 'Redemption Notice',
      value: fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod} days` : 'N/A',
      icon: '⏰'
    },
    {
      label: 'Fund Type',
      value: getFundTypeDisplay(),
      icon: '🔄'
    },
    {
      label: 'Fund Lifetime',
      value: getFundLifetime(),
      icon: '⏳'
    },
    {
      label: 'Manager',
      value: fund.managerName || 'Not specified',
      icon: '👔'
    },
    {
      label: 'Hurdle Rate',
      value: getHurdleRate(fund),
      icon: '📈'
    },
    {
      label: 'CMVM License',
      value: fund.cmvmId ? `#${fund.cmvmId}` : 'N/A',
      icon: '🏛️'
    },
    {
      label: 'Investment Sector',
      value: fund.category,
      icon: '🎯'
    },
    {
      label: 'Subscription Fee',
      value: fund.subscriptionFee ? `${fund.subscriptionFee}%` : 'None',
      icon: '💳'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-card via-card to-muted/30 border-2 border-primary/20 shadow-2xl">
      <CardContent className="p-6 space-y-1">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">📊</span>
            Fund Snapshot
          </h3>
        </div>

        {/* Critical items - always visible */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
          {criticalItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}
              </span>
              <span className="text-sm font-semibold text-foreground text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Collapsible section for additional details */}
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center justify-between py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <span>More key details</span>
            <span className="transition-transform group-open:rotate-180">▾</span>
          </summary>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-2 pt-4 border-t border-border/50">
            {additionalItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-foreground text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </details>
      </CardContent>
    </Card>
  );
};

export default FundSnapshotCard;