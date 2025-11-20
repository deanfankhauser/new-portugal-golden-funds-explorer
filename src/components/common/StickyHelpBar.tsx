import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';

const StickyHelpBar: React.FC = () => {
  const handleClick = () => {
    const contactUrl = buildContactUrl('sticky-help-bar');
    analytics.trackCTAClick('sticky-help-bar', 'consultation', contactUrl);
    openExternalLink(contactUrl);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 hidden md:block">
      <div className="bg-gradient-to-r from-primary to-primary/90 border-t border-primary-foreground/20 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
              <div>
                <p className="text-sm font-semibold text-primary-foreground">
                  Need help choosing the right fund?
                </p>
                <p className="text-xs text-primary-foreground/80">
                  Schedule a free consultation with our specialists
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="bg-background text-primary border-background hover:bg-secondary hover:text-primary font-medium"
              onClick={handleClick}
            >
              Schedule Free Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyHelpBar;
