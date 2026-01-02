import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functionality: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

const defaultPreferences: CookiePreferences = {
  essential: true, // Always required
  analytics: false,
  functionality: false,
};

export const getCookiePreferences = (): CookiePreferences | null => {
  try {
    const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const hasAnalyticsConsent = (): boolean => {
  const prefs = getCookiePreferences();
  return prefs?.analytics ?? false;
};

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsented) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    setShowCustomize(false);
    
    // Dispatch event for analytics integration
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      functionality: true,
    });
  };

  const handleRejectNonEssential = () => {
    savePreferences({
      essential: true,
      analytics: false,
      functionality: false,
    });
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  We use cookies to enhance your experience
                </p>
                <p className="text-xs text-muted-foreground">
                  We use cookies to analyze site traffic and improve our services. 
                  Read our{' '}
                  <Link to="/cookie-policy" className="underline hover:text-foreground">
                    Cookie Policy
                  </Link>{' '}
                  for more information.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomize(true)}
                className="flex items-center gap-1.5"
              >
                <Settings className="h-3.5 w-3.5" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectNonEssential}
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customize Dialog */}
      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Essential cookies are required for the site to function.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Essential Cookies */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Essential Cookies</Label>
                <p className="text-xs text-muted-foreground">
                  Required for the website to function properly
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="space-y-0.5">
                <Label htmlFor="analytics" className="text-sm font-medium">Analytics Cookies</Label>
                <p className="text-xs text-muted-foreground">
                  Help us understand how visitors interact with our site
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            {/* Functionality Cookies */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="space-y-0.5">
                <Label htmlFor="functionality" className="text-sm font-medium">Functionality Cookies</Label>
                <p className="text-xs text-muted-foreground">
                  Remember your preferences and settings
                </p>
              </div>
              <Switch
                id="functionality"
                checked={preferences.functionality}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, functionality: checked }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCustomize(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustom}>
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
