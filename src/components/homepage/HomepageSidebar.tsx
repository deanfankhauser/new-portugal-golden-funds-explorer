
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, TrendingUp, Shield, Zap } from 'lucide-react';
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
      <div className="lg:sticky lg:top-4 space-y-8">
        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-lg hover:shadow-xl 
                        transition-all duration-300 overflow-hidden backdrop-blur-sm
                        bg-gradient-to-br from-white to-gray-50/30">
          <FundFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        
        {/* Enhanced Fund Quiz CTA */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl 
                       border-2 border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-500 
                       overflow-hidden card-hover-effect backdrop-blur-sm relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/30 opacity-60"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/40 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative p-8 text-center space-y-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-5 rounded-3xl 
                              inline-flex interactive-hover-subtle shadow-lg">
                <ClipboardCheck className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 
                              p-2 rounded-full shadow-lg animate-pulse">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
            </div>
            
            <div className="space-y-4">
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
              <Button className="w-full btn-primary-enhanced text-base h-16 font-bold text-lg
                               bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 
                               hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
                               shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300
                               border border-blue-500/20"
                      aria-label="Take fund quiz for personalized recommendations">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
                  <div className="text-left">
                    <div>Take Fund Quiz</div>
                    <div className="text-xs opacity-90">Personalized results</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Platform Stats */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-lg hover:shadow-xl 
                        transition-all duration-300 p-8 backdrop-blur-sm
                        bg-gradient-to-br from-white to-gray-50/30">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
            </div>
            Platform Stats
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white 
                            border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-600">Verified Funds</span>
              </div>
              <span className="font-bold text-primary text-lg">11+</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white 
                            border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total AUM</span>
              </div>
              <span className="font-bold text-blue-600 text-lg">€500M+</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white 
                            border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-600">Avg. Processing</span>
              </div>
              <span className="font-bold text-emerald-600 text-lg">2-3 months</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HomepageSidebar;
