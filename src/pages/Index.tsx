
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-10 text-center md:text-left max-w-4xl mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
            Portugal Golden Visa Funds
          </h1>
          <p className="text-xl text-gray-600">
            Explore qualified investment funds for the Portugal Golden Visa program with our comprehensive directory.
          </p>
        </div>

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
