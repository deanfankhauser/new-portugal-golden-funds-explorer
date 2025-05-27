
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FundListItem from '../components/FundListItem';
import FundFilter from '../components/FundFilter';
import { Fund, FundTag, funds, searchFunds } from '../data/funds';
import PremiumCTA from '../components/cta/PremiumCTA';
import { useAuth } from '../contexts/AuthContext';

const IndexPage = () => {
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = "Portugal Golden Visa Investment Funds | Eligible Investments 2025";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Explore our Portugal Golden Visa Investment Funds List for 2025. Find eligible investment funds to secure residency with a €500,000 investment. Start your journey today!"
      );
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

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
            Portugal Golden Visa Investment Funds
          </h1>
          <p className="text-xl text-gray-600">
            Explore our qualified Portugal Golden Visa Investment funds list with our comprehensive directory.
          </p>
        </div>

        {/* Premium CTA Banner - only show for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mb-8">
            <PremiumCTA variant="banner" location="homepage" />
          </div>
        )}

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
      </main>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
