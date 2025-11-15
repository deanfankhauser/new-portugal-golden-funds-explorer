
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';
import { trackInteraction } from '../../utils/analyticsTracking';

interface IntroductionButtonProps {
  variant?: 'full' | 'compact';
  fundId?: string;
}

const IntroductionButton: React.FC<IntroductionButtonProps> = ({ variant = 'full', fundId }) => {
  const handleIntroductionClick = () => {
    openExternalLink(buildContactUrl('introduction-button'));
    if (fundId) {
      trackInteraction(fundId, 'booking_click');
    }
  };
  
  if (variant === 'compact') {
    return (
      <Button 
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all duration-300"
        onClick={handleIntroductionClick}
      >
        Get Introduction
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    );
  }
  
  return (
    <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-secondary to-card">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-5 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-foreground">Ready to Learn More?</h3>
          
          <p className="text-muted-foreground text-lg leading-relaxed">
            Get a personal introduction to this fund through our team. We'll connect you directly 
            with the fund managers and help guide you through the investment process.
          </p>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2 bg-card p-4 rounded-lg w-full shadow-sm border border-border">
            <Info className="h-4 w-4 flex-shrink-0 text-primary" />
            <span>Our introductions often come with preferential terms not available when going direct.</span>
          </div>
          
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto px-8 py-6 h-auto text-lg font-medium shadow-sm transition-all duration-300"
            onClick={handleIntroductionClick}
          >
            Get Introduction
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntroductionButton;
