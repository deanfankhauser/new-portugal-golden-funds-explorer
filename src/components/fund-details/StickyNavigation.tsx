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

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Sticky Bar */}
      <div className="hidden md:block fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 py-3 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="font-semibold text-lg truncate max-w-md">{fund.name}</h2>
              <span className="text-sm text-muted-foreground">by {fund.managerName}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant={isComparing ? "default" : "outline"}
                size="sm"
                onClick={handleCompareClick}
              >
                {isComparing ? (
                  <>
                    <Plus className="w-4 h-4 mr-1 rotate-45" />
                    Remove
                  </>
                ) : (
                  <>
                    <GitCompare className="w-4 h-4 mr-1" />
                    Compare
                  </>
                )}
              </Button>
              
              <Button 
                size="sm"
                onClick={handleBookCall}
              >
                <Phone className="w-4 h-4 mr-1" />
                Book 15-min Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40 p-4">
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={handleCompareClick}
          >
            <GitCompare className="w-4 h-4 mr-1" />
            {isComparing ? "Remove" : "Compare"}
          </Button>
          
          <Button 
            className="flex-1"
            onClick={handleBookCall}
          >
            <Phone className="w-4 h-4 mr-1" />
            Book Call
          </Button>
        </div>
      </div>
    </>
  );
};

export default StickyNavigation;
