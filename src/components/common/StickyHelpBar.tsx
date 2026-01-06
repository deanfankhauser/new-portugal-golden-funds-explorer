import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';
import FundIntroductionModal from '../modals/FundIntroductionModal';

const DISMISS_STORAGE_KEY = 'cta_banner_dismissed';
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const IMPRESSION_SESSION_KEY = 'cta_banner_impression_tracked';

interface StickyHelpBarProps {
  fundName?: string;
}

const StickyHelpBar: React.FC<StickyHelpBarProps> = ({ fundName }) => {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to prevent flash
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check localStorage and track impression on mount
  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY);
    const now = Date.now();
    
    if (dismissedAt && now - parseInt(dismissedAt) < DISMISS_DURATION_MS) {
      setIsDismissed(true);
      return;
    }
    
    // Not dismissed, show the banner
    setIsDismissed(false);
    
    // Track impression once per session
    if (!sessionStorage.getItem(IMPRESSION_SESSION_KEY)) {
      analytics.trackEvent('cta_banner_impression', {
        location: fundName ? 'fund_detail' : 'homepage',
        fund_name: fundName || undefined
      });
      sessionStorage.setItem(IMPRESSION_SESSION_KEY, 'true');
    }
  }, [fundName]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
    setIsDismissed(true);
    analytics.trackEvent('cta_banner_close', {
      location: fundName ? 'fund_detail' : 'homepage',
      fund_name: fundName || undefined
    });
  };

  const handlePrimaryClick = () => {
    const contactUrl = buildContactUrl('legal_call_banner');
    analytics.trackEvent('cta_banner_primary_click', {
      location: fundName ? 'fund_detail' : 'homepage',
      fund_name: fundName || undefined,
      cta_destination: contactUrl
    });
    openExternalLink(contactUrl);
  };

  const handleSecondaryClick = () => {
    analytics.trackEvent('cta_banner_secondary_click', {
      location: fundName ? 'fund_detail' : 'homepage',
      fund_name: fundName || undefined
    });
    setIsModalOpen(true);
  };

  if (isDismissed) {
    return null;
  }

  const subheadText = fundName
    ? 'Get help with eligibility, documents, timelines — or request a warm intro to this fund.'
    : 'Get help with eligibility, documents, timelines — or request a warm introduction to a fund.';

  return (
    <>
      {/* Desktop Layout */}
      <div className="fixed bottom-0 left-0 right-0 z-40 hidden md:block">
        <div className="bg-primary border-t border-primary-foreground/20 shadow-lg">
          <div className="container mx-auto px-4 py-2.5">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Icon + Text */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <MessageCircle className="h-5 w-5 text-primary-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary-foreground leading-tight">
                    Speak with our Portugal Golden Visa legal team (free)
                  </p>
                  <p className="text-xs text-primary-foreground/80 leading-tight">
                    {subheadText}
                  </p>
                </div>
              </div>

              {/* Right: Buttons + Close */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-background text-primary hover:bg-secondary font-medium whitespace-nowrap"
                  onClick={handlePrimaryClick}
                >
                  Book free legal call (15 min)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-medium whitespace-nowrap"
                  onClick={handleSecondaryClick}
                >
                  Request a fund introduction
                </Button>
                <button
                  onClick={handleDismiss}
                  className="ml-2 p-1.5 rounded-full text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="bg-primary border-t border-primary-foreground/20 shadow-lg">
          <div className="px-4 py-3 relative">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 rounded-full text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="pr-8">
              <div className="flex items-start gap-2 mb-3">
                <MessageCircle className="h-4 w-4 text-primary-foreground shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-primary-foreground leading-tight">
                  Speak with our Portugal Golden Visa legal team (free)
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-background text-primary hover:bg-secondary font-medium text-xs h-10"
                  onClick={handlePrimaryClick}
                >
                  Book free call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-medium text-xs h-10"
                  onClick={handleSecondaryClick}
                >
                  Fund intro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Introduction Modal */}
      <FundIntroductionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fundName={fundName}
      />
    </>
  );
};

export default StickyHelpBar;
