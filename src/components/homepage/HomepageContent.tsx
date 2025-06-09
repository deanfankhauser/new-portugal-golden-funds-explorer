import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import FundFilter from '../FundFilter';
import PremiumCTA from '../cta/PremiumCTA';
import FundListItemSkeleton from '../skeletons/FundListItemSkeleton';
import { FundTag } from '../../data/funds';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Filter, X } from 'lucide-react';

interface HomepageContentProps {
  filteredFunds: Fund[];
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAuthenticated: boolean;
  isLoading?: boolean;
}

const HomepageContent: React.FC<HomepageContentProps> = ({
  filteredFunds,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
  isAuthenticated,
  isLoading = false
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile Filter Toggle Button - Only visible on mobile */}
      <div className="lg:hidden">
        <Button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          variant="outline"
          className="w-full justify-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
        >
          {showMobileFilter ? (
            <>
              <X className="h-4 w-4" />
              Hide Filters
            </>
          ) : (
            <>
              <Filter className="h-4 w-4" />
              Show Filters & Search
            </>
          )}
        </Button>
      </div>

      {/* Mobile Filter Section - Toggleable */}
      {showMobileFilter && (
        <div className="lg:hidden">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
            <FundFilter
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <div className="lg:col-span-1 order-2 lg:order-1 hidden lg:block">
          <div className="lg:sticky lg:top-4 space-y-4 sm:space-y-5">
            {/* Fund Quiz CTA - Enhanced mobile design */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-blue-900 mb-1 text-base sm:text-lg leading-tight">
                    Not sure which fund is right for you?
                  </h3>
                  <p className="text-sm sm:text-base text-blue-700 mb-4 leading-relaxed">
                    Take our quick quiz to get personalized recommendations based on your investment goals
                  </p>
                </div>
              </div>
              <Link to="/fund-quiz" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base h-11 sm:h-12 font-medium">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Take Fund Quiz
                </Button>
              </Link>
            </div>
            
            {/* Filter Section - Enhanced mobile layout */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
              <FundFilter
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {isLoading ? (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
                <p className="text-gray-600 font-medium text-sm sm:text-base">
                  Loading funds...
                </p>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <FundListItemSkeleton key={index} />
                ))}
              </div>
            </>
          ) : filteredFunds.length === 0 ? (
            <div className="text-center py-10 sm:py-12 bg-white rounded-xl shadow-sm border p-6 sm:p-8">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheck className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">No funds found</h3>
                <p className="text-gray-500 mb-6 text-sm sm:text-base leading-relaxed">
                  Try adjusting your filters or search query to find funds that match your criteria
                </p>
                <Link to="/fund-quiz">
                  <Button variant="outline" className="text-sm sm:text-base h-11 sm:h-12 px-6">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Take Quiz for Recommendations
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
                <p className="text-gray-600 font-medium text-sm sm:text-base">
                  {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
                </p>
                <div className="text-xs sm:text-sm text-gray-500">
                  Showing all available funds
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {filteredFunds.map((fund, index) => (
                  <div key={fund.id}>
                    <FundListItem fund={fund} />
                    {/* Insert Premium CTA after every 3 funds - only for non-authenticated users */}
                    {!isAuthenticated && (index + 1) % 3 === 0 && index < filteredFunds.length - 1 && (
                      <div className="my-6 sm:my-8">
                        <PremiumCTA variant="full" location={`homepage-after-fund-${index + 1}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Fund Quiz CTA - Only visible on mobile */}
      <div className="lg:hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-blue-900 mb-1 text-base sm:text-lg leading-tight">
                Not sure which fund is right for you?
              </h3>
              <p className="text-sm sm:text-base text-blue-700 mb-4 leading-relaxed">
                Take our quick quiz to get personalized recommendations based on your investment goals
              </p>
            </div>
          </div>
          <Link to="/fund-quiz" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base h-11 sm:h-12 font-medium">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Take Fund Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomepageContent;
