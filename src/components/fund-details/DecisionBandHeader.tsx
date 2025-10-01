import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Pencil, Calendar } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { buildBookingUrl, openExternalLink } from '../../utils/urlHelpers';
import analytics from '../../utils/analytics';
import { Fund } from '../../data/funds';

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
      {/* Clean Title Section */}
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
        
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Suggest an edit
        </Button>
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
    </div>
  );
};

export default DecisionBandHeader;
