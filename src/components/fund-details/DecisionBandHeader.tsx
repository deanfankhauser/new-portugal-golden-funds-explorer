import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from '../ui/button';
import { Phone, BarChart3, Mail, Pencil } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { buildBookingUrl, openExternalLink } from '../../utils/urlHelpers';
import analytics from '../../utils/analytics';
import { managerToSlug } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import KeyFactsChips from './KeyFactsChips';
import TrustBadges from './TrustBadges';
import PerformancePreview from './PerformancePreview';
import FundSnapshotCard from './FundSnapshotCard';

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

  const handleEmailFund = () => {
    const subject = encodeURIComponent(`Inquiry about ${fund.name}`);
    const body = encodeURIComponent(`I'm interested in learning more about ${fund.name}.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    analytics.trackCTAClick('decision_band_header', 'email_fund', 'mailto');
  };

  // Determine fund status
  const isOpenForSubscriptions = fund.fundStatus === 'Open';

  // Create one-line summary
  const hasGoldenVisa = fund.tags?.some(tag => tag.toLowerCase().includes('golden visa'));
  const redemptionFreq = fund.redemptionTerms?.frequency?.toLowerCase() || 'regular redemptions';
  
  const summary = `${fund.regulatedBy || 'CMVM'}-regulated, ${fund.term ? 'closed-ended' : 'open-ended'} ${fund.category.toLowerCase()}. ${redemptionFreq === 'daily' ? 'Daily liquidity.' : 'Regular redemptions.'}${hasGoldenVisa ? ' Golden Visa eligible.' : ''}`;

  return (
    <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden rounded-lg">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Fund Identity & Actions */}
          <div className="space-y-6">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    {fund.name}
                  </h1>
                  {isOpenForSubscriptions && (
                    <Badge className="bg-green-500/20 text-green-100 border-green-400/30 whitespace-nowrap">
                      Open for subscriptions
                    </Badge>
                  )}
                </div>
                {fund.managerName && (
                  <Link 
                    to={`/manager/${managerToSlug(fund.managerName)}`}
                    className="inline-flex items-center text-base text-white/80 hover:text-accent-foreground font-medium transition-colors"
                  >
                    <span className="mr-2">Managed by</span>
                    <span className="underline underline-offset-4 text-accent-foreground">{fund.managerName}</span>
                    <span className="ml-2">→</span>
                  </Link>
                )}
              </div>
              
              {/* Suggest Edit Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Suggest an edit</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Proposed changes are reviewed before going live.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* One-line Summary */}
            <p className="text-base sm:text-lg text-white/90 max-w-4xl">
              {summary}
            </p>

            {/* Performance Preview */}
            <PerformancePreview fund={fund} />

            {/* Key Facts Chips */}
            <KeyFactsChips fund={fund} />

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
                onClick={handleBookCall}
              >
                <Phone className="mr-2 h-5 w-5" />
                Book 30-min Call
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-white/40 text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm font-semibold"
                onClick={handleCompareClick}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                {isCompared ? "In Compare" : "Add to Compare"}
              </Button>
            </div>

            {/* Optional Email Link */}
            <button
              onClick={handleEmailFund}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email this fund
            </button>

            {/* Trust Row */}
            <div className="space-y-3">
              <TrustBadges fund={fund} />
              
              <p className="text-xs text-white/60">
                Capital at risk. Past performance isn't indicative.
              </p>
            </div>
          </div>

          {/* Right Side - Fund Snapshot Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <FundSnapshotCard fund={fund} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionBandHeader;
