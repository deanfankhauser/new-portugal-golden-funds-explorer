
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import FundFilter from '../FundFilter';
import PremiumCTA from '../cta/PremiumCTA';
import FundListSkeleton from '../common/FundListSkeleton';
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
}

const HomepageContent: React.FC<HomepageContentProps> = ({
  filteredFunds,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
  isAuthenticated
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="spacing-responsive-md">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Mobile Filter Toggle Button - Enhanced accessibility and interactions */}
      <div className="lg:hidden">
        <Button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          variant="outline"
          className="w-full justify-center gap-2 sm:gap-3 bg-white border-gray-200 hover:bg-gray-50 
                     h-12 sm:h-14 text-sm sm:text-base font-medium interactive-hover btn-secondary-enhanced"
          aria-expanded={showMobileFilter}
          aria-controls="mobile-filter-section"
          aria-label={showMobileFilter ? "Hide filters and search" : "Show filters and search"}
        >
          {showMobileFilter ? (
            <>
              <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Hide Filters
            </>
          ) : (
            <>
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Show Filters & Search
            </>
          )}
        </Button>
      </div>

      {/* Mobile Filter Section - Enhanced accessibility */}
      {showMobileFilter && (
        <div className="lg:hidden" id="mobile-filter-section">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm card-hover-effect">
            <h2 className="sr-only">Filter and Search Options</h2>
            <FundFilter
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Sidebar - Enhanced visual hierarchy and accessibility */}
        <aside className="lg:col-span-1 order-2 lg:order-1 hidden lg:block" aria-label="Sidebar navigation">
          <div className="lg:sticky lg:top-4 spacing-responsive-sm">
            {/* Fund Quiz CTA - Enhanced contrast and interactions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-xl 
                           border border-blue-200 shadow-sm card-hover-effect">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="bg-blue-100 p-2.5 sm:p-3 rounded-lg flex-shrink-0 interactive-hover">
                  <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-blue-900 mb-2 text-base sm:text-lg lg:text-xl 
                                leading-tight text-high-contrast">
                    Not sure which fund is right for you?
                  </h3>
                  <p className="text-sm sm:text-base text-blue-700 mb-4 sm:mb-5 leading-relaxed text-medium-contrast">
                    Take our quick quiz to get personalized recommendations based on your investment goals
                  </p>
                </div>
              </div>
              <Link to="/fund-quiz" className="block">
                <Button className="w-full btn-primary-enhanced text-sm sm:text-base h-12 sm:h-14 
                                 font-medium transition-smooth"
                        aria-label="Take fund quiz to get personalized recommendations">
                  <ClipboardCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  Take Fund Quiz
                </Button>
              </Link>
            </div>
            
            {/* Filter Section - Enhanced accessibility */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm card-hover-effect">
              <h2 className="sr-only">Filter Options</h2>
              <FundFilter
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
        </aside>
        
        {/* Main Content - Enhanced accessibility and visual hierarchy */}
        <main className="lg:col-span-3 order-1 lg:order-2" id="main-content">
          {isLoading ? (
            <div role="status" aria-label="Loading funds">
              <FundListSkeleton />
            </div>
          ) : filteredFunds.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20 bg-white rounded-xl shadow-sm 
                           border p-6 sm:p-8 lg:p-12 card-hover-effect">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center 
                               justify-center mx-auto mb-4 sm:mb-6 interactive-hover">
                  <ClipboardCheck className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-high-contrast">
                  No funds found
                </h3>
                <p className="text-medium-contrast mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Try adjusting your filters or search query to find funds that match your criteria
                </p>
                <Link to="/fund-quiz">
                  <Button variant="outline" 
                          className="text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 font-medium btn-secondary-enhanced"
                          aria-label="Take quiz for fund recommendations">
                    <ClipboardCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    Take Quiz for Recommendations
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-2 sm:gap-4">
                <p className="text-high-contrast font-medium text-sm sm:text-base lg:text-lg" role="status">
                  {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
                </p>
                <div className="text-xs sm:text-sm lg:text-base text-medium-contrast">
                  Showing all available funds
                </div>
              </div>
              <div className="spacing-responsive-md">
                {filteredFunds.map((fund, index) => (
                  <div key={fund.id}>
                    <div className="card-hover-effect">
                      <FundListItem fund={fund} />
                    </div>
                    {/* Insert Premium CTA with enhanced spacing */}
                    {!isAuthenticated && (index + 1) % 3 === 0 && index < filteredFunds.length - 1 && (
                      <div className="my-6 sm:my-8 lg:my-10">
                        <PremiumCTA variant="full" location={`homepage-after-fund-${index + 1}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Fund Quiz CTA - Enhanced accessibility and interactions */}
      <div className="lg:hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-xl 
                       border border-blue-200 shadow-sm card-hover-effect">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="bg-blue-100 p-2.5 sm:p-3 rounded-lg flex-shrink-0 interactive-hover">
              <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-blue-900 mb-2 text-base sm:text-lg leading-tight text-high-contrast">
                Not sure which fund is right for you?
              </h3>
              <p className="text-sm sm:text-base text-blue-700 mb-4 sm:mb-5 leading-relaxed text-medium-contrast">
                Take our quick quiz to get personalized recommendations based on your investment goals
              </p>
            </div>
          </div>
          <Link to="/fund-quiz" className="block">
            <Button className="w-full btn-primary-enhanced text-sm sm:text-base h-12 sm:h-14 
                             font-medium transition-smooth"
                    aria-label="Take fund quiz to get personalized recommendations">
              <ClipboardCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Take Fund Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomepageContent;
