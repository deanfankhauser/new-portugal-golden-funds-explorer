import React from 'react';
import { Badge } from '../ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { Fund } from '../../data/funds';
import { FundEditButton } from '../fund-editing';

interface DecisionBandHeaderProps {
  fund: Fund;
}

const DecisionBandHeader: React.FC<DecisionBandHeaderProps> = ({ fund }) => {
  const isOpenForSubscriptions = fund.fundStatus === 'Open';

  return (
    <div className="space-y-4">
      {/* Header with Suggest Edit */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {fund.isVerified && (
              <div className="bg-success text-success-foreground px-3 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 shadow-md border border-success/70 animate-in fade-in duration-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ VERIFIED FUND</span>
              </div>
            )}
            {isOpenForSubscriptions && (
              <Badge variant="success" className="text-[13px] font-medium">
                Open for subscriptions
              </Badge>
            )}
            {!fund.isVerified && (
              <Badge variant="outline" className="text-[13px] font-medium">Unverified</Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {fund.name}
          </h1>
          
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            {fund.description}
          </p>
        </div>
        
        <FundEditButton 
          fund={fund}
          variant="outline"
          size="sm"
          className="shrink-0"
        />
      </div>
    </div>
  );
};

export default DecisionBandHeader;
