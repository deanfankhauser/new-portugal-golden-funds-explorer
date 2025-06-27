
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';
import FundFilter from '../FundFilter';
import { FundTag } from '../../data/funds';

interface HomepageSidebarProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HomepageSidebar: React.FC<HomepageSidebarProps> = ({
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <aside className="lg:col-span-1 order-2 lg:order-1 hidden lg:block" aria-label="Sidebar tools">
      <div className="lg:sticky lg:top-4 space-y-6">
        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <FundFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        
        {/* Enhanced Fund Quiz CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl 
                       border-2 border-blue-200 shadow-sm overflow-hidden card-hover-effect">
          <div className="p-6 text-center space-y-6">
            <div className="relative">
              <div className="bg-blue-100 p-4 rounded-2xl inline-flex interactive-hover-subtle">
                <ClipboardCheck className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-blue-900 text-xl text-high-contrast">
                Find Your Perfect Fund
              </h3>
              <p className="text-sm text-blue-700 text-medium-contrast leading-relaxed">
                Get AI-powered recommendations tailored to your investment goals and risk tolerance
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">3-minute smart quiz</span>
              </div>
            </div>
            
            <Link to="/fund-quiz" className="block">
              <Button className="w-full btn-primary-enhanced text-base h-14 font-semibold
                               bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                               shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      aria-label="Take fund quiz for personalized recommendations">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                  <div className="text-left">
                    <div>Take Fund Quiz</div>
                    <div className="text-xs opacity-90">Personalized results</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Platform Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Verified Funds</span>
              <span className="font-bold text-primary">11+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total AUM</span>
              <span className="font-bold text-blue-600">€500M+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Processing</span>
              <span className="font-bold text-emerald-600">2-3 months</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HomepageSidebar;
