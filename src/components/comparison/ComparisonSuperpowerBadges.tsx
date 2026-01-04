import React from 'react';
import { Fund } from '@/data/types/funds';
import { calculateRiskBand } from '@/utils/riskCalculation';
import { Badge } from '@/components/ui/badge';
import { Trophy, Shield, Clock } from 'lucide-react';

interface ComparisonSuperpowerBadgesProps {
  fund: Fund;
  comparisonFund: Fund;
}

const ComparisonSuperpowerBadges: React.FC<ComparisonSuperpowerBadgesProps> = ({ fund, comparisonFund }) => {
  const badges: Array<{ icon: React.ReactNode; label: string; show: boolean }> = [];
  
  // Lowest Entry Badge - Compare minimum investments
  const fund1Min = fund.minimumInvestment || Infinity;
  const fund2Min = comparisonFund.minimumInvestment || Infinity;
  
  if (fund1Min <= fund2Min && fund1Min !== Infinity) {
    badges.push({
      icon: <Trophy className="w-3 h-3" />,
      label: 'Lowest Entry',
      show: true
    });
  }
  
  // Safest Option Badge - Compare risk bands
  const riskOrder = { 'Conservative': 1, 'Balanced': 2, 'Aggressive': 3 };
  const risk1 = calculateRiskBand(fund);
  const risk2 = calculateRiskBand(comparisonFund);
  const risk1Level = riskOrder[risk1] || 4;
  const risk2Level = riskOrder[risk2] || 4;
  
  if (risk1Level <= risk2Level && risk1Level !== 4) {
    badges.push({
      icon: <Shield className="w-3 h-3" />,
      label: 'Safest Option',
      show: true
    });
  }
  
  // Fastest Exit Badge - Compare minimum holding periods
  const holdingPeriod1 = fund.redemptionTerms?.minimumHoldingPeriod || Infinity;
  const holdingPeriod2 = comparisonFund.redemptionTerms?.minimumHoldingPeriod || Infinity;
  
  if (holdingPeriod1 <= holdingPeriod2 && holdingPeriod1 !== Infinity) {
    badges.push({
      icon: <Clock className="w-3 h-3" />,
      label: 'Fastest Exit',
      show: true
    });
  }
  
  if (badges.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {badges.map((badge, index) => (
        <Badge 
          key={index} 
          variant="secondary"
          className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
        >
          {badge.icon}
          <span className="ml-1">{badge.label}</span>
        </Badge>
      ))}
    </div>
  );
};

export default ComparisonSuperpowerBadges;
