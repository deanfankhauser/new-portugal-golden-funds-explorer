import React from 'react';
import { Shield, CheckCircle, Info } from 'lucide-react';
import { Fund } from '@/data/types/funds';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { isFundGVEligible } from '@/data/services/gv-eligibility-service';
import { GV_LABELS } from '@/utils/gvComplianceLabels';

interface ManagerTrustIndicatorsProps {
  funds: Fund[];
  className?: string;
}

const ManagerTrustIndicators: React.FC<ManagerTrustIndicatorsProps> = ({ 
  funds,
  className = '' 
}) => {
  if (funds.length === 0) return null;

  // Check if manager has GV-intended funds (only verified funds)
  const hasGVIntendedFunds = funds.some(fund => isFundGVEligible(fund) && fund.isVerified);
  
  // Check if manager has CMVM regulated funds
  const hasCMVMFunds = funds.some(fund => 
    fund.cmvmId || 
    fund.regulatedBy?.toLowerCase().includes('cmvm')
  );

  // If no trust indicators available, don't show anything
  if (!hasGVIntendedFunds && !hasCMVMFunds) {
    return (
      <div className={`inline-flex items-center gap-2 bg-muted/50 text-muted-foreground px-4 py-2 rounded-lg text-sm border border-border ${className}`}>
        <Info className="w-4 h-4" />
        <span>Manager profile under review</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {hasGVIntendedFunds && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm cursor-help">
                <CheckCircle className="w-4 h-4" />
                GV-intended Funds (manager-stated)
                <Info className="w-3 h-3 opacity-60" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              <p>{GV_LABELS.TOOLTIP}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {hasCMVMFunds && (
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
            <Shield className="w-4 h-4" />
            CMVM Regulated
          </Badge>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ManagerTrustIndicators;
