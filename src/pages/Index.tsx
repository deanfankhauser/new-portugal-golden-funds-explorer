
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageSEO pageType="homepage" />
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 flex-1 max-w-7xl">
        <div className="mb-8 sm:mb-10 text-center md:text-left max-w-5xl mx-auto md:mx-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 text-gray-800 leading-tight px-2 sm:px-0">
            Portugal Golden Visa Investment Funds
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 px-2 sm:px-0 max-w-4xl">
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
        />

        <HomepageInfoSections />
      </main>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
