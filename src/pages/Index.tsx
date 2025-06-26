
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
      
      <main className="container mx-auto container-responsive-padding py-6 sm:py-8 lg:py-12 flex-1 max-w-7xl">
        {/* Hero Section - Streamlined and focused */}
        <header className="mb-8 sm:mb-10 lg:mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold 
                         mb-4 sm:mb-6 text-high-contrast leading-tight">
            Portugal Golden Visa Investment Funds
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-medium-contrast 
                       mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore qualified investment funds for your Portugal Golden Visa application
          </p>
          
          {/* Last Updated - More prominent placement */}
          <div className="flex justify-center mb-6 sm:mb-8" role="complementary">
            <LastUpdated />
          </div>

          {/* Primary CTA - More prominent for non-authenticated users */}
          {!isAuthenticated && (
            <div className="mb-8 sm:mb-10" role="complementary" aria-label="Get expert guidance">
              <PremiumCTA variant="banner" location="homepage-hero" />
            </div>
          )}
        </header>

        <HomepageContent
          filteredFunds={filteredFunds}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isAuthenticated={isAuthenticated}
        />

        {/* Info Sections - Moved after main content for better flow */}
        <section className="mt-12 sm:mt-16 lg:mt-20" aria-label="Additional resources">
          <HomepageInfoSections />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
