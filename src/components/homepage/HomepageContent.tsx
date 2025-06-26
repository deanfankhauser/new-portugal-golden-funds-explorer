
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import FundFilter from '../FundFilter';
import PremiumCTA from '../cta/PremiumCTA';
import FundListSkeleton from '../common/FundListSkeleton';
import { FundTag } from '../../data/funds';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Filter, X, Search } from 'lucide-react';

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

      {/* Mobile Filter Toggle - Streamlined */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          variant="outline"
          className="w-full justify-center gap-3 bg-white border-gray-200 hover:bg-gray-50 
                     h-14 text-base font-medium interactive-hover btn-secondary-enhanced"
          aria-expanded={showMobileFilter}
          aria-controls="mobile-filter-section"
          aria-label={showMobileFilter ? "Hide search and filters" : "Show search and filters"}
        >
          {showMobileFilter ? (
            <>
              <X className="h-5 w-5" aria-hidden="true" />
              Hide Search & Filters
            </>
          ) : (
            <>
              <Search className="h-5 w-5" aria-hidden="true" />
              Search & Filter Funds
            </>
          )}
        </Button>
      </div>

      {/* Mobile Filter Section */}
      {showMobileFilter && (
        <div className="lg:hidden mb-6" id="mobile-filter-section">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm card-hover-effect">
            <FundFilter
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Left Sidebar - Streamlined and reorganized */}
        <aside className="lg:col-span-1 order-2 lg:order-1 hidden lg:block" aria-label="Sidebar tools">
          <div className="lg:sticky lg:top-4 space-y-6">
            {/* Filter Section - Moved to top priority */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm card-hover-effect">
              <h2 className="text-lg font-semibold mb-4 text-high-contrast">Search & Filter</h2>
              <FundFilter
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            
            {/* Fund Quiz CTA - Streamlined content */}
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
        
        {/* Main Content - Improved information hierarchy */}
        <main className="lg:col-span-3 order-1 lg:order-2" id="main-content">
          {isLoading ? (
            <div role="status" aria-label="Loading funds">
              <FundListSkeleton />
            </div>
          ) : filteredFunds.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border p-8 card-hover-effect">
              <div className="max-w-md mx-auto space-y-6">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center 
                               justify-center mx-auto interactive-hover">
                  <Search className="h-10 w-10 text-gray-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-high-contrast">
                    No funds match your criteria
                  </h3>
                  <p className="text-medium-contrast mb-6 leading-relaxed">
                    Try adjusting your search or take our quiz for personalized recommendations
                  </p>
                </div>
                <div className="space-y-3">
                  <Link to="/fund-quiz">
                    <Button className="w-full btn-primary-enhanced text-base h-12 font-medium"
                            aria-label="Take quiz for fund recommendations">
                      <ClipboardCheck className="mr-2 h-5 w-5" aria-hidden="true" />
                      Get Personalized Recommendations
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full text-base h-12 font-medium btn-secondary-enhanced"
                    onClick={() => {
                      setSelectedTags([]);
                      setSearchQuery('');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header - More scannable */}
              <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="text-high-contrast font-semibold text-lg" role="status">
                    {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
                  </p>
                  <p className="text-sm text-medium-contrast">
                    All funds are Golden Visa eligible
                  </p>
                </div>
                {(selectedTags.length > 0 || searchQuery) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedTags([]);
                      setSearchQuery('');
                    }}
                    className="text-sm"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Fund List */}
              <div className="space-y-6">
                {filteredFunds.map((fund, index) => (
                  <div key={fund.id}>
                    <div className="card-hover-effect">
                      <FundListItem fund={fund} />
                    </div>
                    {/* Strategic CTA placement - every 4th fund for better user journey */}
                    {!isAuthenticated && (index + 1) % 4 === 0 && index < filteredFunds.length - 1 && (
                      <div className="my-8">
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

      {/* Mobile Fund Quiz CTA - Streamlined */}
      <div className="lg:hidden mt-8">
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
                Get personalized recommendations in under 2 minutes
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
    </div>
  );
};

export default HomepageContent;
