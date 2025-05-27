
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

    // Create JSON-LD structured data for the fund listings
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': 'https://portugalvisafunds.com/'
      },
      'name': 'Portugal Golden Visa Investment Funds Directory',
      'description': 'Comprehensive directory of eligible investment funds for the Portugal Golden Visa program',
      'numberOfItems': funds.length,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'FinancialProduct',
          'name': fund.name,
          'description': fund.description,
          'category': fund.category,
          'provider': {
            '@type': 'Organization',
            'name': fund.managerName
          },
          'url': `https://portugalvisafunds.com/funds/${fund.id}`,
          'offers': {
            '@type': 'Offer',
            'price': fund.minimumInvestment,
            'priceCurrency': 'EUR'
          }
        }
      })),
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://portugalvisafunds.com'
          }
        ]
      }
    };
    
    script.textContent = JSON.stringify(structuredData);
    
    // Remove any existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(s => s.remove());
    
    // Add the new structured data script
    document.head.appendChild(script);
    
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(s => s.remove());
    };
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
          <p className="text-xl text-gray-600 mb-6">
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

        {/* Informational sections moved to bottom */}
        <div className="mt-16 max-w-4xl mx-auto">
          {/* What are Golden Visa Funds explanation */}
          <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">What are Portugal Golden Visa Investment Funds?</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Portugal Golden Visa investment funds are specially qualified investment vehicles that allow non-EU citizens to obtain Portuguese residency through financial investment. Under the current program, investors must commit a minimum of €500,000 to eligible investment funds.
              </p>
              <p>
                These funds focus on supporting the Portuguese economy through various sectors including real estate, venture capital, infrastructure, and innovation. All funds listed in our directory are officially approved by Portuguese authorities and meet the strict criteria required for Golden Visa eligibility.
              </p>
              <p className="font-medium">
                Key benefits include: Portuguese residency permit, visa-free travel within the Schengen area, path to permanent residency and citizenship, and the ability to include family members in your application.
              </p>
            </div>
          </div>

          {/* Additional descriptive content */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Why Choose Our Fund Directory?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <h4 className="font-medium mb-2">Comprehensive Coverage</h4>
                <p className="text-sm">Access detailed information on all major Golden Visa eligible funds, including performance metrics, fee structures, and investment strategies.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Expert Analysis</h4>
                <p className="text-sm">Each fund profile includes professional analysis, risk assessments, and suitability recommendations to help you make informed decisions.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Real-time Updates</h4>
                <p className="text-sm">Our database is continuously updated with the latest fund information, regulatory changes, and market developments.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Comparison Tools</h4>
                <p className="text-sm">Compare multiple funds side-by-side to evaluate investment terms, expected returns, and alignment with your investment goals.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
