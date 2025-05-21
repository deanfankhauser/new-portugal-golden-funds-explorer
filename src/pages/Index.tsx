
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FundListItem from '../components/FundListItem';
import FundFilter from '../components/FundFilter';
import { Fund, FundTag, funds, searchFunds } from '../data/funds';

const IndexPage = () => {
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFunds = useMemo(() => {
    let result = [...funds];
    
    // Apply tag filtering
    if (selectedTags.length > 0) {
      result = result.filter(fund => 
        selectedTags.every(tag => fund.tags.includes(tag))
      );
    }
    
    // Apply search
    if (searchQuery) {
      result = searchFunds(searchQuery);
    }
    
    return result;
  }, [selectedTags, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Portugal Golden Visa Investment Funds
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore qualified investment funds for the Portugal Golden Visa program with our comprehensive directory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FundFilter
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          
          <div className="lg:col-span-3">
            {filteredFunds.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium mb-2">No funds found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-gray-600">{filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found</p>
                <div className="space-y-4">
                  {filteredFunds.map(fund => (
                    <FundListItem key={fund.id} fund={fund} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
