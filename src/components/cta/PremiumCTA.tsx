import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Users, Shield, Zap, ExternalLink } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface PremiumCTAProps {
  variant?: 'compact' | 'full' | 'banner';
  location?: string;
}

const PremiumCTA: React.FC<PremiumCTAProps> = ({ variant = 'full', location = 'general' }) => {
  const handleCTAClick = () => {
    // Track the CTA click with location for analytics
    analytics.trackCTAClick(location, `premium-${variant}`, 'https://contact.movingto.com');
    
    // Track external link click
    analytics.trackExternalLink(
      'https://contact.movingto.com',
      'Get Premium Access',
      `cta-${location}`
    );
    
    // Premium CTA clicked tracking
    window.open('https://contact.movingto.com', '_blank');
  };

  if (variant === 'compact') {
    return (
      <Button 
        className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
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
      <div className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4 text-left">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-white" />
            <div>
              <p className="font-semibold text-white">Get Expert Fund Guidance</p>
              <p className="text-sm text-white opacity-90">Personal consultation with our Golden Visa specialists</p>
            </div>
          </div>
          <Button 
            variant="outline"
            className="bg-white text-[#EF4444] border-white hover:bg-gray-50 hover:text-[#EF4444] font-medium"
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
    <Card className="border-2 border-[#EF4444]/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] p-3 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Unlock Premium Fund Guidance
            </h3>
            <p className="text-gray-600 text-lg">
              Get personalized guidance from our Golden Visa experts to maximize your investment success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <Users className="h-4 w-4 text-[#EF4444]" />
              <span>1-on-1 Expert Consultation</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <Shield className="h-4 w-4 text-[#EF4444]" />
              <span>Due Diligence Reports</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <Zap className="h-4 w-4 text-[#EF4444]" />
              <span>Priority Fund Access</span>
            </div>
          </div>
          
          <div className="bg-[#EF4444]/5 p-4 rounded-lg border border-[#EF4444]/20">
            <p className="text-[#EF4444] font-medium text-sm">
              ✨ Premium clients often secure better terms and exclusive fund opportunities not available to the public
            </p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white w-full md:w-auto px-8 py-6 h-auto text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
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
