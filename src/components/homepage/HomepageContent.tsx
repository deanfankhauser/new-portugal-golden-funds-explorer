
import React from 'react';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import FundFilter from '../FundFilter';
import PremiumCTA from '../cta/PremiumCTA';
import { FundTag } from '../../data/funds';

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <FundFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      
      <div className="lg:col-span-3">
        {filteredFunds.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border p-8">
            <h3 className="text-xl font-medium mb-2">No funds found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600 font-medium">{filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-6">
              {filteredFunds.map((fund, index) => (
                <div key={fund.id}>
                  <FundListItem fund={fund} />
                  {/* Insert Premium CTA after every 3 funds - only for non-authenticated users */}
                  {!isAuthenticated && (index + 1) % 3 === 0 && index < filteredFunds.length - 1 && (
                    <div className="my-6">
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
  );
};

export default HomepageContent;
