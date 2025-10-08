import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Calendar, BarChart3 } from 'lucide-react';
import { Fund } from '../../data/funds';
import { useComparison } from '../../contexts/ComparisonContext';
import { buildBookingUrl, openExternalLink } from '../../utils/urlHelpers';
import analytics from '../../utils/analytics';

interface FloatingCTAProps {
  fund: Fund;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ fund }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isInComparison, addToComparison } = useComparison();
  const isCompared = isInComparison(fund.id);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookCall = () => {
    const bookingUrl = buildBookingUrl(fund.id, fund.name);
    openExternalLink(bookingUrl);
    analytics.trackCTAClick('floating_cta', 'book_call', bookingUrl);
  };

  const handleCompareClick = () => {
    addToComparison(fund);
    analytics.trackEvent('add_to_comparison', {
      fund_id: fund.id,
      fund_name: fund.name,
      source: 'floating_cta'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-right">
      {/* Mobile Layout - Stacked buttons */}
      <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border shadow-2xl px-4 py-3">
        <div className="flex flex-col gap-2 max-w-lg mx-auto">
          <Button 
            size="lg"
            className="w-full gap-2 h-14 text-base font-semibold shadow-lg"
            onClick={handleBookCall}
          >
            <Calendar className="h-5 w-5" />
            Book 30-min Call
          </Button>
          
          <Button
            variant={isCompared ? "secondary" : "outline"}
            size="lg"
            onClick={handleCompareClick}
            className="w-full gap-2 h-14 text-base font-semibold shadow-lg border-2"
          >
            <BarChart3 className="h-5 w-5" />
            {isCompared ? 'In Comparison' : 'Compare Fund'}
          </Button>
        </div>
      </div>

      {/* Desktop Layout - Side by side buttons */}
      <div className="hidden lg:block bg-background/95 backdrop-blur-md border-t border-border shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{fund.name}</p>
                <p className="text-xs text-muted-foreground">{fund.category}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                size="lg"
                className="gap-2 shadow-lg"
                onClick={handleBookCall}
              >
                <Calendar className="h-5 w-5" />
                Book 30-min Call
              </Button>
              
              <Button
                variant={isCompared ? "secondary" : "outline"}
                size="lg"
                onClick={handleCompareClick}
                className="gap-2 shadow-lg border-2"
              >
                <BarChart3 className="h-5 w-5" />
                {isCompared ? 'In Comparison' : 'Compare'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;
