import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { MessageSquare, Heart } from 'lucide-react';
import { Fund } from '../../data/funds';
import analytics from '../../utils/analytics';
import { trackInteraction } from '../../utils/analyticsTracking';
import { FundEnquiryModal } from './FundEnquiryModal';
import { useSavedFunds } from '../../hooks/useSavedFunds';

interface FloatingCTAProps {
  fund: Fund;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ fund }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const { isFundSaved, saveFund, unsaveFund } = useSavedFunds();

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSaved = isFundSaved(fund.id);

  const handleSaveFund = async () => {
    if (isSaved) {
      await unsaveFund(fund.id);
    } else {
      await saveFund(fund.id);
    }
    analytics.trackEvent('save_fund', {
      fund_id: fund.id,
      fund_name: fund.name,
      action: isSaved ? 'unsave' : 'save',
      source: 'floating_cta'
    });
    trackInteraction(fund.id, 'save_fund');
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-right">
        {/* Mobile Layout - Side by side buttons */}
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border shadow-2xl px-4 py-3">
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            <Button 
              size="lg"
              className="w-full gap-2 h-14 text-sm font-semibold shadow-lg"
              onClick={() => setEnquiryModalOpen(true)}
            >
              <MessageSquare className="h-5 w-5" />
              Get in Touch
            </Button>
            
            <Button 
              size="lg"
              variant={isSaved ? "secondary" : "outline"}
              className="w-full gap-2 h-14 text-sm font-semibold shadow-lg border-2"
              onClick={handleSaveFund}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Desktop Layout - Centered buttons */}
        <div className="hidden lg:block bg-background/95 backdrop-blur-md border-t border-border shadow-2xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
              <Button 
                size="lg"
                className="gap-2 shadow-lg"
                onClick={() => setEnquiryModalOpen(true)}
              >
                <MessageSquare className="h-5 w-5" />
                Get in Touch
              </Button>
              
              <Button 
                size="lg"
                variant={isSaved ? "secondary" : "outline"}
                className="gap-2 shadow-lg border-2"
                onClick={handleSaveFund}
              >
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enquiry Modal */}
      <FundEnquiryModal 
        open={enquiryModalOpen} 
        onOpenChange={setEnquiryModalOpen} 
        fund={fund} 
      />
    </>
  );
};

export default FloatingCTA;
