
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

const IntroductionButton: React.FC = () => {
  return (
    <div className="mt-8 bg-gray-50 border border-gray-100 rounded-lg p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <h3 className="text-xl font-semibold">Ready to Learn More?</h3>
        
        <p className="text-gray-700 max-w-2xl">
          Get a personal introduction to this fund through our team. We'll connect you directly 
          with the fund managers and help guide you through the investment process.
        </p>
        
        <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
          <Info className="h-4 w-4 text-[#EF4444]" />
          <span>Our introductions often come with preferential terms not available when going direct.</span>
        </div>
        
        <Button 
          className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white px-6 py-3 text-base"
        >
          Get Introduction
        </Button>
      </div>
    </div>
  );
};

export default IntroductionButton;
