
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
        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm card-hover-effect">
          <h2 className="text-lg font-semibold mb-4 text-high-contrast">Search & Filter</h2>
          <FundFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        
        {/* Fund Quiz CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl 
                       border border-blue-200 shadow-sm card-hover-effect">
          <div className="text-center space-y-4">
            <div className="bg-blue-100 p-3 rounded-lg inline-flex interactive-hover">
              <ClipboardCheck className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2 text-lg text-high-contrast">
                Find Your Ideal Fund
              </h3>
              <p className="text-sm text-blue-700 mb-4 text-medium-contrast">
                Get personalized recommendations based on your investment goals
              </p>
            </div>
            <Link to="/fund-quiz" className="block">
              <Button className="w-full btn-primary-enhanced text-base h-12 font-medium transition-smooth"
                      aria-label="Take fund quiz for personalized recommendations">
                <ClipboardCheck className="mr-2 h-5 w-5" aria-hidden="true" />
                Take Fund Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HomepageSidebar;
