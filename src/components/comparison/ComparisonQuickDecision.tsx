import React from 'react';
import { Fund } from '@/data/types/funds';
import { Lightbulb } from 'lucide-react';

interface ComparisonQuickDecisionProps {
  fund1: Fund;
  fund2: Fund;
}

const ComparisonQuickDecision: React.FC<ComparisonQuickDecisionProps> = ({ fund1, fund2 }) => {
  // Determine key differentiators
  const fund1Lower = (fund1.managementFee || 0) < (fund2.managementFee || 0);
  const fund2Lower = (fund2.managementFee || 0) < (fund1.managementFee || 0);
  
  const fund1MinLower = (fund1.minimumInvestment || Infinity) < (fund2.minimumInvestment || Infinity);
  
  const fund1HasRedemption = fund1.redemptionTerms && Array.isArray(fund1.redemptionTerms) && fund1.redemptionTerms.length > 0;
  const fund2HasRedemption = fund2.redemptionTerms && Array.isArray(fund2.redemptionTerms) && fund2.redemptionTerms.length > 0;
  
  // Build recommendation text
  const buildRecommendation = (fund: Fund, otherFund: Fund, isFirst: boolean) => {
    const reasons: string[] = [];
    
    if (isFirst && fund1Lower) {
      reasons.push('lower management fees');
    } else if (!isFirst && fund2Lower) {
      reasons.push('lower management fees');
    }
    
    if (isFirst && fund1MinLower) {
      reasons.push('lower minimum investment');
    } else if (!isFirst && !fund1MinLower && fund.minimumInvestment) {
      reasons.push('manageable entry point');
    }
    
    if ((isFirst && fund1HasRedemption && !fund2HasRedemption) || (!isFirst && fund2HasRedemption && !fund1HasRedemption)) {
      reasons.push('better liquidity terms');
    }
    
    if (fund.category && otherFund.category && fund.category !== otherFund.category) {
      reasons.push(`${fund.category?.toLowerCase()} exposure`);
    }
    
    if (reasons.length === 0) {
      reasons.push('its unique strategy and approach');
    }
    
    return reasons.slice(0, 2).join(' and ');
  };

  return (
    <div className="bg-gradient-to-br from-primary to-primary-700 rounded-2xl p-7 mb-12 text-white">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-2 text-white">Quick Decision Guide</h3>
          <p className="text-[14px] leading-relaxed text-white/95">
            Choose <strong className="font-semibold text-white">{fund1.name}</strong> if you prioritize {buildRecommendation(fund1, fund2, true)}.
            {' '}Choose <strong className="font-semibold text-white">{fund2.name}</strong> if you prefer {buildRecommendation(fund2, fund1, false)}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonQuickDecision;
