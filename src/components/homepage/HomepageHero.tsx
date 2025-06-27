
import React from 'react';
import PremiumCTA from '../cta/PremiumCTA';
import LastUpdated from '../common/LastUpdated';

interface HomepageHeroProps {
  isAuthenticated: boolean;
}

const HomepageHero: React.FC<HomepageHeroProps> = ({ isAuthenticated }) => {
  return (
    <header className="mb-16 sm:mb-20 lg:mb-24 text-center max-w-6xl mx-auto relative overflow-hidden">
      {/* Enhanced background with more depth */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-primary/15 via-primary/8 to-transparent rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/15 via-blue-500/8 to-transparent rounded-full blur-2xl opacity-50 floating"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-500/15 via-emerald-500/8 to-transparent rounded-full blur-2xl opacity-40 floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-500/15 via-purple-500/8 to-transparent rounded-full blur-2xl opacity-30 floating" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 px-4">
        {/* Enhanced badge with animation */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 
                          text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6 
                          border border-primary/30 backdrop-blur-sm shadow-lg hover:shadow-xl
                          transition-all duration-300 hover:scale-105 cursor-default">
            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-lg"></div>
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
              Updated for 2025
            </span>
            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Enhanced main heading with better typography */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black 
                         mb-6 sm:mb-8 text-high-contrast leading-[0.9] tracking-tight">
            <span className="block mb-2 opacity-95">Portugal</span>
            <span className="block bg-gradient-to-r from-primary via-primary/90 to-primary/80 
                           bg-clip-text text-transparent drop-shadow-sm">
              Golden Visa
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-4 font-semibold opacity-90">
              Investment Funds
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl sm:text-2xl md:text-3xl text-medium-contrast 
                         mb-8 sm:mb-10 leading-relaxed font-light">
              Explore <span className="font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">
                qualified investment funds
              </span> for your Portugal Golden Visa application
            </p>
          </div>
        </div>

        {/* Enhanced trust indicators with better visual hierarchy */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-12">
          <div className="flex items-center gap-3 text-sm font-medium text-medium-contrast 
                          bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full border border-gray-200/50 
                          shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-gray-700">11+ Verified Funds</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-medium-contrast 
                          bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full border border-gray-200/50 
                          shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.3s' }}></div>
            <span className="text-gray-700">€500M+ AUM</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-medium-contrast 
                          bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full border border-gray-200/50 
                          shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.6s' }}></div>
            <span className="text-gray-700">100% Transparent</span>
          </div>
        </div>
        
        {/* Enhanced last updated section */}
        <div className="flex justify-center mb-10 sm:mb-12" role="complementary">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 
                          shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <LastUpdated />
          </div>
        </div>

        {/* Enhanced CTA section for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mb-12 sm:mb-16" role="complementary" aria-label="Get expert guidance">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 rounded-3xl blur-2xl opacity-80"></div>
              <div className="relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm 
                              rounded-3xl p-8 border border-gray-200/50 shadow-xl">
                <PremiumCTA variant="banner" location="homepage-hero" />
              </div>
            </div>
          </div>
        )}

        {/* New scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomepageHero;
