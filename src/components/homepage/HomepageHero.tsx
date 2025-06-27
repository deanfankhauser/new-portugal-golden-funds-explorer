
import React from 'react';
import PremiumCTA from '../cta/PremiumCTA';
import LastUpdated from '../common/LastUpdated';

interface HomepageHeroProps {
  isAuthenticated: boolean;
}

const HomepageHero: React.FC<HomepageHeroProps> = ({ isAuthenticated }) => {
  return (
    <header className="mb-12 sm:mb-16 lg:mb-20 max-w-7xl mx-auto container-responsive-padding">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-full blur-2xl opacity-40"></div>
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-full blur-2xl opacity-30"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold 
                         mb-4 sm:mb-6 text-high-contrast leading-[1.1] tracking-tight">
            <span className="block">Portugal Golden Visa</span>
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 
                           bg-clip-text text-transparent">
              Investment Funds
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-medium-contrast 
                       mb-8 sm:mb-10 max-w-4xl leading-relaxed font-light mx-auto">
            Explore <span className="font-semibold text-primary">qualified investment funds</span> for your 
            Portugal Golden Visa application
          </p>
          
          <div className="flex justify-center mb-8 sm:mb-10" role="complementary">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
              <LastUpdated />
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mb-10 sm:mb-12" role="complementary" aria-label="Get expert guidance">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-xl"></div>
                <div className="relative">
                  <PremiumCTA variant="banner" location="homepage-hero" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomepageHero;
