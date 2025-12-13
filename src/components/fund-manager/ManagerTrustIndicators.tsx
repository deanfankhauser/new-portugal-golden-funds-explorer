import React from 'react';
import { Shield, CheckCircle, Info } from 'lucide-react';
import { Fund } from '@/data/types/funds';
import { Badge } from '@/components/ui/badge';
import { isFundGVEligible } from '@/data/services/gv-eligibility-service';

interface ManagerTrustIndicatorsProps {
  funds: Fund[];
  className?: string;
}

const ManagerTrustIndicators: React.FC<ManagerTrustIndicatorsProps> = ({ 
  funds,
  className = '' 
}) => {
  if (funds.length === 0) return null;

  // Check if manager has Golden Visa eligible funds (only verified funds)
  const hasGVEligibleFunds = funds.some(fund => isFundGVEligible(fund) && fund.isVerified);
  
  // Check if manager has CMVM regulated funds
  const hasCMVMFunds = funds.some(fund => 
    fund.cmvmId || 
    fund.regulatedBy?.toLowerCase().includes('cmvm')
  );

  // If no trust indicators available, don't show anything
  if (!hasGVEligibleFunds && !hasCMVMFunds) {
    return (
      <div className={`inline-flex items-center gap-2 bg-muted/50 text-muted-foreground px-4 py-2 rounded-lg text-sm border border-border ${className}`}>
        <Info className="w-4 h-4" />
        <span>Manager profile under review</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {hasGVEligibleFunds && (
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
          <CheckCircle className="w-4 h-4" />
          Golden Visa Eligible Funds
        </Badge>
      )}
      {hasCMVMFunds && (
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
          <Shield className="w-4 h-4" />
          CMVM Regulated
        </Badge>
      )}
    </div>
  );
};

export default ManagerTrustIndicators;
