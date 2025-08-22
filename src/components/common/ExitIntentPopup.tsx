import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Users, Shield, Zap } from 'lucide-react';
import { analytics } from '@/utils/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { buildContactUrl, openExternalLink } from '@/utils/urlHelpers';

interface ExitIntentPopupProps {
  isEnabled?: boolean;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ isEnabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { isAuthenticated } = useAuth();

  // Check if popup was dismissed within the last 14 days
  const wasRecentlyDismissed = () => {
    const dismissedAt = localStorage.getItem('exitIntentDismissedAt');
    if (!dismissedAt) return false;
    
    const dismissedTime = new Date(dismissedAt).getTime();
    const now = new Date().getTime();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    
    return (now - dismissedTime) < fourteenDays;
  };

  useEffect(() => {
    // Don't show popup if user is already authenticated, popup is disabled, or was recently dismissed
    if (!isEnabled || hasShown || isAuthenticated || wasRecentlyDismissed()) return;

    let mouseLeaveTimer: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page (indicating intent to close/navigate away)
      if (e.clientY <= 0 && !hasShown) {
        mouseLeaveTimer = setTimeout(() => {
          setIsOpen(true);
          setHasShown(true);
          analytics.trackEvent('exit_intent_popup_shown', {
            trigger: 'mouse_leave',
            page_path: window.location.pathname
          });
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };

    // Also trigger on beforeunload for mobile/keyboard navigation
    const handleBeforeUnload = () => {
      if (!hasShown && Math.random() < 0.3) { // Show to 30% of users trying to leave
        setIsOpen(true);
        setHasShown(true);
        analytics.trackEvent('exit_intent_popup_shown', {
          trigger: 'before_unload',
          page_path: window.location.pathname
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };
  }, [isEnabled, hasShown, isAuthenticated]);

  const handleContactClick = () => {
    const contactUrl = buildContactUrl('exit-intent-popup');
    analytics.trackCTAClick('exit_intent_popup', 'contact_expert', contactUrl);
    analytics.trackExternalLink(contactUrl, 'Speak with Expert', 'exit_intent');
    openExternalLink(contactUrl);
    setIsOpen(false);
  };

  const handleClose = () => {
    analytics.trackEvent('exit_intent_popup_dismissed', {
      action: 'close_button',
      page_path: window.location.pathname
    });
    localStorage.setItem('exitIntentDismissedAt', new Date().toISOString());
    setIsOpen(false);
  };

  const handleContinue = () => {
    analytics.trackEvent('exit_intent_popup_dismissed', {
      action: 'continue_browsing',
      page_path: window.location.pathname
    });
    localStorage.setItem('exitIntentDismissedAt', new Date().toISOString());
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-primary/20">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-full">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-foreground">
            Wait! Don't Miss Out
          </DialogTitle>
          
          <DialogDescription className="text-lg text-muted-foreground">
            Get personalized fund recommendations from our Golden Visa experts before you go
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
              <Users className="h-4 w-4 text-primary flex-shrink-0" />
              <span>1-on-1 Expert Consultation</span>
            </div>
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Exclusive Fund Opportunities</span>
            </div>
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
              <Zap className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Faster Application Process</span>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <p className="text-primary font-medium text-sm text-center">
              ✨ Most clients secure better terms through our expert introductions
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleContactClick}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold h-12"
            >
              <Users className="mr-2 h-5 w-5" />
              Speak with an Expert
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleContinue}
              className="w-full"
            >
              Continue Browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;