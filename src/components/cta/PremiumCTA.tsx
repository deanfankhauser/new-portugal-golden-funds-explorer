import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, FileCheck, Scale, FileText, ExternalLink } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';

interface PremiumCTAProps {
  variant?: 'compact' | 'full' | 'banner';
  location?: string;
}

const PremiumCTA: React.FC<PremiumCTAProps> = ({ variant = 'full', location = 'general' }) => {
  const handleCTAClick = () => {
    const contactUrl = buildContactUrl(`introduction-${variant}-${location}`);
    
    // Track the CTA click with location for analytics
    analytics.trackCTAClick(location, `introduction-${variant}`, contactUrl);
    
    // Track external link click
    analytics.trackExternalLink(contactUrl, 'Get in Touch', `cta-${location}`);
    
    // Introduction CTA clicked tracking
    openExternalLink(contactUrl);
  };

  if (variant === 'compact') {
    return (
      <Button 
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow transition-all duration-200"
        onClick={handleCTAClick}
      >
        <Crown className="mr-2 h-4 w-4" />
        Get in Touch
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
              <p className="font-semibold text-primary-foreground">Speak with Movingto</p>
              <p className="text-sm text-primary-foreground opacity-90">Personal consultation with our specialists</p>
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
    <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-200 bg-background overflow-hidden">
      <CardContent className="p-0">
        <div className="text-center space-y-8 p-10">
          {/* Header with Icon */}
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-4 shadow-sm">
              <Crown className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          
          {/* Title and Subtitle */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <h3 className="text-3xl font-semibold text-foreground tracking-tight">
              Speak with Movingto
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Get expert legal support for your Golden Visa application
            </p>
          </div>
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-muted/30 px-4 py-3.5 rounded-lg border border-border/50 hover:border-border transition-colors">
              <FileCheck className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">1-on-1 Consultation</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-muted/30 px-4 py-3.5 rounded-lg border border-border/50 hover:border-border transition-colors">
              <Scale className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">Application Support</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-muted/30 px-4 py-3.5 rounded-lg border border-border/50 hover:border-border transition-colors">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">Legal Documentation</span>
            </div>
          </div>
          
          {/* Value Proposition */}
          <div className="bg-accent/30 px-6 py-4 rounded-lg border border-accent/40 max-w-3xl mx-auto">
            <p className="text-sm text-foreground/80 leading-relaxed">
              ✨ Our experts help you navigate the Golden Visa process and secure approval efficiently
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="pt-2">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-medium shadow-sm hover:shadow transition-all duration-200"
              onClick={handleCTAClick}
            >
              <Crown className="mr-2 h-4 w-4" />
              Get in Touch
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumCTA;
