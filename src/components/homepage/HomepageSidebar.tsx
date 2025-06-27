
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, TrendingUp, Shield, Clock, ArrowRight, Sparkles } from 'lucide-react';
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
      <div className="lg:sticky lg:top-6 space-y-8">
        {/* Enhanced Filter Section */}
        <div className="bg-gradient-to-br from-white via-white to-gray-50/50 rounded-3xl 
                       border-2 border-gray-200/50 shadow-xl overflow-hidden backdrop-blur-sm
                       hover:shadow-2xl transition-all duration-300">
          <FundFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        
        {/* Enhanced Fund Quiz CTA */}
        <div className="relative bg-gradient-to-br from-blue-50 via-blue-50/50 to-indigo-50/50 
                       rounded-3xl border-2 border-blue-200/50 shadow-xl overflow-hidden 
                       hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 
                         to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-400/10 
                         to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative p-8 text-center space-y-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-3xl 
                             inline-flex shadow-lg group-hover:shadow-xl transition-all duration-300
                             hover:scale-110 interactive-hover-subtle">
                <ClipboardCheck className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 
                             p-2 rounded-full shadow-lg animate-pulse">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-black text-blue-900 text-2xl text-high-contrast">
                Find Your Perfect Fund
              </h3>
              <p className="text-blue-700 text-medium-contrast leading-relaxed font-medium">
                Get AI-powered recommendations tailored to your investment goals and risk tolerance
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600 
                             bg-blue-100/50 px-4 py-2 rounded-full w-fit mx-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-bold">3-minute smart quiz</span>
              </div>
            </div>
            
            <Link to="/fund-quiz" className="block">
              <Button className="w-full btn-primary-enhanced text-lg h-16 font-bold
                               bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 
                               hover:from-blue-700 hover:via-blue-800 hover:to-blue-900
                               shadow-xl hover:shadow-2xl transform hover:scale-105 
                               transition-all duration-300 rounded-2xl border-0"
                      aria-label="Take fund quiz for personalized recommendations">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-lg">Take Fund Quiz</div>
                    <div className="text-sm opacity-90 font-medium">Personalized results</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="bg-gradient-to-br from-white via-white to-gray-50/50 rounded-3xl 
                       border-2 border-gray-200/50 shadow-xl p-8 hover:shadow-2xl 
                       transition-all duration-300 hover:scale-[1.02]">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-xl">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
            Platform Stats
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl
                           hover:bg-gray-100/50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium text-gray-600">Verified Funds</span>
              </div>
              <span className="font-black text-xl text-primary">11+</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl
                           hover:bg-gray-100/50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-600">Total AUM</span>
              </div>
              <span className="font-black text-xl text-blue-600">€500M+</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl
                           hover:bg-gray-100/50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-gray-600">Avg. Processing</span>
              </div>
              <span className="font-black text-xl text-emerald-600">2-3 months</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HomepageSidebar;
