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

  // Helper function to bold percentages and key investment terms in description
  const formatDescription = (text: string) => {
    // Bold percentages (e.g., "65%", "35%")
    let formatted = text.replace(/(\d+%)/g, '<strong>$1</strong>');
    
    // Bold key investment terms
    const termsToHighlight = [
      'Portuguese fixed income',
      'digital assets',
      'real estate',
      'private equity',
      'venture capital',
      'public markets',
      'fixed income',
      'equities'
    ];
    
    termsToHighlight.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      formatted = formatted.replace(regex, '<strong>$1</strong>');
    });
    
    return formatted;
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-8 md:p-10">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            {fund.isVerified && (
              <div className="bg-success/10 text-success px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 border border-success/20">
                <CheckCircle2 className="w-4 h-4" />
                Verified Fund
              </div>
            )}
            {isOpenForSubscriptions && (
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[13px] font-semibold border border-primary/20">
                Open for subscriptions
              </div>
            )}
            {!fund.isVerified && (
              <Badge variant="outline" className="text-[13px] font-medium px-4 py-2 rounded-xl">
                Unverified
              </Badge>
            )}
          </div>
          
          {/* Fund Name */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            {fund.name}
          </h1>
          
          {/* Description with bold key terms */}
          <p 
            className="text-lg text-foreground/70 max-w-3xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatDescription(fund.description) }}
          />
        </div>
        
        {/* Edit Button */}
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
