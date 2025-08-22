import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Users, Shield, Zap, ExternalLink } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';

interface PremiumCTAProps {
  variant?: 'compact' | 'full' | 'banner';
  location?: string;
}

const PremiumCTA: React.FC<PremiumCTAProps> = ({ variant = 'full', location = 'general' }) => {
  const handleCTAClick = () => {
    const contactUrl = buildContactUrl(`premium-${variant}-${location}`);
    
    // Track the CTA click with location for analytics
    analytics.trackCTAClick(location, `premium-${variant}`, contactUrl);
    
    // Track external link click
    analytics.trackExternalLink(contactUrl, 'Get Premium Access', `cta-${location}`);
    
    // Premium CTA clicked tracking
    openExternalLink(contactUrl);
  };

  if (variant === 'compact') {
    return (
      <Button 
        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
        onClick={handleCTAClick}
      >
        <Crown className="mr-2 h-4 w-4" />
        Unlock Premium Features
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4 text-left">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-primary-foreground" />
            <div>
              <p className="font-semibold text-primary-foreground">Get Expert Fund Guidance</p>
              <p className="text-sm text-primary-foreground opacity-90">Personal consultation with our Golden Visa specialists</p>
            </div>
          </div>
          <Button 
            variant="outline"
            className="bg-background text-primary border-background hover:bg-secondary hover:text-primary font-medium"
            onClick={handleCTAClick}
          >
            Start Now
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-background to-secondary/30">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary to-primary/90 p-3 rounded-full">
              <Crown className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Unlock Premium Fund Guidance
            </h3>
            <p className="text-muted-foreground text-lg">
              Get personalized guidance from our Golden Visa experts to maximize your investment success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>1-on-1 Expert Consultation</span>
            </div>
            <div className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>Due Diligence Reports</span>
            </div>
            <div className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Priority Fund Access</span>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <p className="text-primary font-medium text-sm">
              ✨ Premium clients often secure better terms and exclusive fund opportunities not available to the public
            </p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground w-full md:w-auto px-8 py-6 h-auto text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={handleCTAClick}
          >
            <Crown className="mr-2 h-5 w-5" />
            Get Premium Access
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumCTA;
