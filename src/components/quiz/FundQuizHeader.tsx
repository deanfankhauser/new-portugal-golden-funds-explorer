
import React from 'react';
import { Card } from '@/components/ui/card';
import { ClipboardCheck, Target, TrendingUp, Sparkles } from 'lucide-react';

const FundQuizHeader = () => {
  return (
    <>
      <div className="text-center mb-10 sm:mb-12">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
            <ClipboardCheck className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-800 px-2 sm:px-0">
          Portugal Golden Visa Fund Recommendation Quiz
        </h1>
        <h2 className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
          Get personalized Portugal Golden Visa investment fund recommendations tailored to your investment profile, 
          risk tolerance, and financial goals in just a few minutes.
        </h2>
      </div>

      {/* Benefits Cards */}
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
        <Card className="text-center p-4 sm:p-6">
          <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Personalized Matching</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Our algorithm matches funds based on your specific risk profile and investment goals
          </p>
        </Card>
        <Card className="text-center p-4 sm:p-6">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2 sm:mb-3" />
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Optimized Returns</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Find funds that offer the best potential returns within your comfort zone
          </p>
        </Card>
        <Card className="text-center p-4 sm:p-6">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2 sm:mb-3" />
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Expert Curation</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            All recommendations come from our carefully vetted portfolio of Golden Visa funds
          </p>
        </Card>
      </div>
    </>
  );
};

export default FundQuizHeader;
