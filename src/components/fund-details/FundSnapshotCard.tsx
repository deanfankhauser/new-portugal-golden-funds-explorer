import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from 'lucide-react';

interface FundSnapshotCardProps {
  fund: Fund;
}

const FundSnapshotCard: React.FC<FundSnapshotCardProps> = ({ fund }) => {
  // Helper function to extract CMVM license number
  const getCMVMLicense = () => {
    const cmvmMatch = fund.cmvmId?.match(/\d+/);
    return cmvmMatch ? cmvmMatch[0] : 'Not available';
  };

  // Helper function to determine investment profile
  const getInvestmentProfile = () => {
    if (fund.category?.toLowerCase().includes('real estate') || fund.category?.toLowerCase().includes('property')) {
      return 'Real Estate';
    }
    if (fund.category?.toLowerCase().includes('equity') || fund.category?.toLowerCase().includes('stock')) {
      return 'Equity Growth';
    }
    if (fund.category?.toLowerCase().includes('debt') || fund.category?.toLowerCase().includes('bond')) {
      return 'Fixed Income';
    }
    if (fund.category?.toLowerCase().includes('mixed') || fund.category?.toLowerCase().includes('balanced')) {
      return 'Balanced';
    }
    return 'Alternative Investment';
  };

  // Helper function to check US citizen eligibility
  const getUSEligibility = () => {
    // Check if fund explicitly mentions US restrictions
    const hasUSRestriction = fund.tags?.some(tag => 
      tag.toLowerCase().includes('us') && tag.toLowerCase().includes('restrict')
    ) || fund.detailedDescription?.toLowerCase().includes('us persons');
    
    return !hasUSRestriction;
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
      label: "Investment Profile", 
      value: getInvestmentProfile()
    },
    {
      label: "Open to US Citizens",
      value: usEligible ? "Yes" : "No",
      icon: usEligible ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />
    },
    {
      label: "Minimum Investment",
      value: fund.minimumInvestment || "Contact for details"
    },
    {
      label: "Subscription Deadline",
      value: getSubscriptionDeadline()
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
      label: "CMVM License Number",
      value: getCMVMLicense()
    }
  ];

  return (
    <Card className="bg-card border shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Fund Snapshot</h3>
          <Badge variant="outline" className="text-xs">
            Key Details
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {snapshotData.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0">
              <span className="text-sm text-muted-foreground font-medium">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground text-right">
                  {item.value}
                </span>
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FundSnapshotCard;