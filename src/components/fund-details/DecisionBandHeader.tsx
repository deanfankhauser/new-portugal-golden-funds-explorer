import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
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
      <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300 max-w-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-5">Why This Fund?</h2>
          <div className="space-y-3">
            {hasGoldenVisa && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-success/5 to-success/10 border border-success/20">
                <div className="p-1.5 rounded-full bg-success/20 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-success" />
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">Golden Visa Eligible</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Qualifies for Portugal's Golden Visa program
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="p-1.5 rounded-full bg-primary/20 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">{fund.regulatedBy || 'CMVM'} Regulated</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Licensed and supervised by Portuguese authorities
                </p>
              </div>
            </div>
            {redemptionFreq === 'daily' && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                <div className="p-1.5 rounded-full bg-accent/20 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">Daily Liquidity</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Redeem your investment any business day
                  </p>
                </div>
              </div>
            )}
            {fund.established && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-muted/5 to-muted/10 border border-border">
                <div className="p-1.5 rounded-full bg-muted/20 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">Established {fund.established}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {new Date().getFullYear() - Number(fund.established)} years of track record
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionBandHeader;
