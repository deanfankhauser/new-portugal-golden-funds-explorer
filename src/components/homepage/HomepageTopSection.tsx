
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';

const HomepageTopSection: React.FC = () => {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Fund Quiz CTA - Smaller */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl 
                       border-2 border-blue-200 shadow-sm overflow-hidden">
          <div className="p-4 text-center space-y-4">
            <div className="relative">
              <div className="bg-blue-100 p-2 rounded-xl inline-flex">
                <ClipboardCheck className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-blue-900 text-lg">
                Find Your Perfect Fund
              </h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Get AI-powered recommendations tailored to your investment goals and risk tolerance
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">3-minute smart quiz</span>
              </div>
            </div>
            
            <Link to="/fund-quiz" className="block">
              <Button className="w-full text-sm h-10 font-semibold
                               bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                               shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      aria-label="Take fund quiz for personalized recommendations">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                  <div className="text-left">
                    <div>Take Fund Quiz</div>
                    <div className="text-xs opacity-90">Personalized results</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Platform Stats - Much Smaller */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Platform Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">Verified Funds</span>
              <span className="font-bold text-primary text-sm">11+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">Total AUM</span>
              <span className="font-bold text-blue-600 text-sm">€500M+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">Avg. Processing</span>
              <span className="font-bold text-emerald-600 text-sm">2-3 months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageTopSection;
