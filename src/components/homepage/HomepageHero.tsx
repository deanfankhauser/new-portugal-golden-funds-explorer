
import React from 'react';
import PremiumCTA from '../cta/PremiumCTA';
import LastUpdated from '../common/LastUpdated';

interface HomepageHeroProps {
  isAuthenticated: boolean;
}

const HomepageHero: React.FC<HomepageHeroProps> = ({ isAuthenticated }) => {
  return (
    <header className="mb-8 sm:mb-10 lg:mb-12 text-center max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold 
                     mb-4 sm:mb-6 text-high-contrast leading-tight">
        Portugal Golden Visa Investment Funds
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-medium-contrast 
                   mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
        Explore qualified investment funds for your Portugal Golden Visa application
      </p>
      
      <div className="flex justify-center mb-6 sm:mb-8" role="complementary">
        <LastUpdated />
      </div>

      {!isAuthenticated && (
        <div className="mb-8 sm:mb-10" role="complementary" aria-label="Get expert guidance">
          <PremiumCTA variant="banner" location="homepage-hero" />
        </div>
      )}
    </header>
  );
};

export default HomepageHero;
