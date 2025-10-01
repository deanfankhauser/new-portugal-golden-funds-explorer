import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, GitCompare, Phone } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { buildBookingUrl, openExternalLink } from '../../utils/urlHelpers';
import analytics from '../../utils/analytics';
import type { Fund } from '../../data/types/funds';

interface StickyNavigationProps {
  fund: Fund;
}

const StickyNavigation: React.FC<StickyNavigationProps> = ({ fund }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  const isComparing = isInComparison(fund.id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 400); // Show after scrolling past decision band
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCompareClick = () => {
    if (isComparing) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
      analytics.trackEvent('add_to_comparison', {
        fund_id: fund.id,
        fund_name: fund.name,
        source: 'sticky_nav'
      });
    }
  };

  const handleBookCall = () => {
    const bookingUrl = buildBookingUrl(fund.id, fund.name);
    openExternalLink(bookingUrl);
    analytics.trackCTAClick('sticky_nav', 'book_call', bookingUrl);
  };

  return (
    <>
      {/* Desktop sticky bar */}
      <div
        className={`hidden md:block fixed top-0 left-0 right-0 z-40 bg-card border-b border-border shadow-lg transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {fund.name}
              </h2>
              {fund.managerName && (
                <p className="text-sm text-muted-foreground truncate">
                  {fund.managerName}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompareClick}
              >
                <GitCompare className="mr-2 h-4 w-4" />
                {isComparing ? "In Compare" : "Add to Compare"}
              </Button>
              <Button
                size="sm"
                onClick={handleBookCall}
              >
                <Phone className="mr-2 h-4 w-4" />
                Book Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {fund.name.length > 30 ? `${fund.name.substring(0, 30)}...` : fund.name}
              </h3>
            </div>
            <Button
              size="sm"
              onClick={handleBookCall}
              className="whitespace-nowrap"
            >
              <Phone className="mr-2 h-4 w-4" />
              Book Call
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyNavigation;
