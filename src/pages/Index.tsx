
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PremiumCTA from '../components/cta/PremiumCTA';
import { useAuth } from '../contexts/AuthContext';
import { useFundFiltering } from '../hooks/useFundFiltering';
import PageSEO from '../components/common/PageSEO';
import HomepageContent from '../components/homepage/HomepageContent';
import HomepageInfoSections from '../components/homepage/HomepageInfoSections';
import LastUpdated from '../components/common/LastUpdated';

const IndexPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    filteredFunds
  } = useFundFiltering();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Add scroll to top handler for internal links
  const handleInternalLinkClick = () => {
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageSEO pageType="homepage" />
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        <div className="mb-8 sm:mb-10 text-center md:text-left max-w-4xl mx-auto md:mx-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gray-800 leading-tight">
            Portugal Golden Visa Investment Funds
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6 px-2 sm:px-0">
            Explore our qualified Portugal Golden Visa Investment funds list with our comprehensive directory.
          </p>
          
          {/* Last Updated Timestamp */}
          <div className="flex justify-center md:justify-start mb-4">
            <LastUpdated />
          </div>
        </div>

        {/* Premium CTA Banner - only show for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mb-6 sm:mb-8">
            <PremiumCTA variant="banner" location="homepage" />
          </div>
        )}

        <HomepageContent
          filteredFunds={filteredFunds}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isAuthenticated={isAuthenticated}
          onInternalLinkClick={handleInternalLinkClick}
        />

        <HomepageInfoSections />
      </main>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
