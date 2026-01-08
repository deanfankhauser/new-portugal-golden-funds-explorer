import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';
import { useCookieConsentStatus } from '@/hooks/useCookieConsent';

const DISMISS_STORAGE_KEY = 'cta_banner_dismissed';
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const IMPRESSION_SESSION_KEY = 'cta_banner_impression_tracked';

interface StickyHelpBarProps {
  fundName?: string;
}

const StickyHelpBar: React.FC<StickyHelpBarProps> = ({ fundName }) => {
  const hasCookieConsent = useCookieConsentStatus();
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to prevent flash

  // Check localStorage and track impression on mount
  useEffect(() => {
    // Don't show until cookie consent is handled
    if (!hasCookieConsent) {
      setIsDismissed(true);
      return;
    }

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
  }, [fundName, hasCookieConsent]);

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

  if (isDismissed) {
    return null;
  }

  const subheadText = 'Get help with eligibility, documents, and timelines.';

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

              {/* Right: Button */}
              <div className="shrink-0">
                <Button
                  size="sm"
                  className="bg-background text-primary hover:bg-background/90 font-medium whitespace-nowrap"
                  onClick={handlePrimaryClick}
                >
                  Book free legal call (15 min)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default StickyHelpBar;
