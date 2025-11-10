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

  // Simplified one-line summary with verification gating
  const hasGoldenVisa = fund.tags?.some(tag => tag.toLowerCase().includes('golden visa'));
  const redemptionFreq = fund.redemptionTerms?.frequency?.toLowerCase();
  
  const summary = `${fund.term ? 'closed-ended' : 'open-ended'} ${fund.category.toLowerCase()}${redemptionFreq === 'daily' ? ' with daily liquidity' : ''}` +
    (fund.isVerified ? `${fund.regulatedBy ? `, ${fund.regulatedBy}-regulated` : ', CMVM-regulated'}` : '') +
    (fund.isVerified && hasGoldenVisa ? '. Golden Visa eligible' : '.');

  return (
    <div className="space-y-4">
      {/* Header with Suggest Edit */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {fund.isVerified && (
              <div className="bg-success text-success-foreground px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg border-2 border-success/70 ring-2 ring-success/30 animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5" />
                <span>✓ VERIFIED FUND</span>
              </div>
            )}
            {isOpenForSubscriptions && (
              <Badge variant="success" className="text-xs font-medium">
                Open for subscriptions
              </Badge>
            )}
            {!fund.isVerified && (
              <Badge variant="outline" className="text-xs font-medium">Unverified</Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {fund.name}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {summary}
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
