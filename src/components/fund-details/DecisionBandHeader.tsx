import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { buildBookingUrl, openExternalLink } from '../../utils/urlHelpers';
import analytics from '../../utils/analytics';
import { Fund } from '../../data/funds';
import { FundEditButton } from '../fund-editing';

interface DecisionBandHeaderProps {
  fund: Fund;
}

const DecisionBandHeader: React.FC<DecisionBandHeaderProps> = ({ fund }) => {
  const { isInComparison, addToComparison } = useComparison();
  const isCompared = isInComparison(fund.id);

  const handleCompareClick = () => {
    addToComparison(fund);
    analytics.trackEvent('add_to_comparison', {
      fund_id: fund.id,
      fund_name: fund.name,
      source: 'decision_band_header'
    });
  };

  const handleBookCall = () => {
    const bookingUrl = buildBookingUrl(fund.id, fund.name);
    openExternalLink(bookingUrl);
    analytics.trackCTAClick('decision_band_header', 'book_call', bookingUrl);
  };

  const isOpenForSubscriptions = fund.fundStatus === 'Open';

  // Simplified one-line summary
  const hasGoldenVisa = fund.tags?.some(tag => tag.toLowerCase().includes('golden visa'));
  const redemptionFreq = fund.redemptionTerms?.frequency?.toLowerCase();
  
  const summary = `${fund.regulatedBy || 'CMVM'}-regulated, ${fund.term ? 'closed-ended' : 'open-ended'} ${fund.category.toLowerCase()}${redemptionFreq === 'daily' ? ' with daily liquidity' : ''}${hasGoldenVisa ? '. Golden Visa eligible' : ''}.`;

  return (
    <div className="space-y-8">
      {/* Header with Suggest Edit */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {isOpenForSubscriptions && (
              <Badge variant="success" className="text-xs font-medium">
                Open for subscriptions
              </Badge>
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

      {/* Clean CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-md">
        <Button 
          size="lg"
          className="gap-2 flex-1"
          onClick={handleBookCall}
        >
          <Calendar className="h-5 w-5" />
          Book 30-min Call
        </Button>
        
        <Button
          variant={isCompared ? "secondary" : "outline"}
          size="lg"
          onClick={handleCompareClick}
          className="flex-1"
        >
          {isCompared ? 'In Comparison' : 'Compare'}
        </Button>
      </div>

      {/* Key Highlights Section */}
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-lg font-semibold">Why This Fund?</h2>
        <ul className="space-y-3">
          {hasGoldenVisa && (
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Golden Visa Eligible</strong> — Qualifies for Portugal's Golden Visa program
              </span>
            </li>
          )}
          <li className="flex items-start gap-3">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <span className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{fund.regulatedBy || 'CMVM'} Regulated</strong> — Licensed and supervised by Portuguese authorities
            </span>
          </li>
          {redemptionFreq === 'daily' && (
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Daily Liquidity</strong> — Redeem your investment any business day
              </span>
            </li>
          )}
          {fund.established && (
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Established {fund.established}</strong> — {new Date().getFullYear() - Number(fund.established)} years of track record
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DecisionBandHeader;
