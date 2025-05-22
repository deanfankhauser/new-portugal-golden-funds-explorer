
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface IntroductionButtonProps {
  variant?: 'full' | 'compact';
}

const IntroductionButton: React.FC<IntroductionButtonProps> = ({ variant = 'full' }) => {
  if (variant === 'compact') {
    return (
      <Button 
        className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white"
      >
        Get Introduction
      </Button>
    );
  }
  
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all bg-gray-50">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800">Ready to Learn More?</h3>
          
          <p className="text-gray-700">
            Get a personal introduction to this fund through our team. We'll connect you directly 
            with the fund managers and help guide you through the investment process.
          </p>
          
          <div className="flex items-center gap-2 text-gray-700 text-sm mb-2 bg-white p-3 rounded-lg w-full">
            <Info className="h-4 w-4 flex-shrink-0 text-[#EF4444]" />
            <span>Our introductions often come with preferential terms not available when going direct.</span>
          </div>
          
          <Button 
            className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white w-full md:w-auto px-8 py-6 h-auto text-lg"
          >
            Get Introduction
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntroductionButton;
