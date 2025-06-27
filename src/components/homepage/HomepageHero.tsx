
import React from 'react';
import PremiumCTA from '../cta/PremiumCTA';
import LastUpdated from '../common/LastUpdated';

interface HomepageHeroProps {
  isAuthenticated: boolean;
}

const HomepageHero: React.FC<HomepageHeroProps> = ({ isAuthenticated }) => {
  return (
    <header className="mb-12 sm:mb-16 lg:mb-20 text-center max-w-6xl mx-auto">
      <div className="relative overflow-hidden">
        {/* Enhanced background decoration with animations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] 
                         bg-gradient-to-br from-primary/15 via-primary/8 to-transparent 
                         rounded-full blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute top-20 left-1/4 w-80 h-80 
                         bg-gradient-to-br from-blue-500/12 via-blue-500/6 to-transparent 
                         rounded-full blur-2xl opacity-50 floating"></div>
          <div className="absolute top-40 right-1/4 w-64 h-64 
                         bg-gradient-to-br from-emerald-500/12 via-emerald-500/6 to-transparent 
                         rounded-full blur-2xl opacity-40 floating" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 animate-fade-in">
          {/* Enhanced status badge */}
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 
                            text-primary px-6 py-3 rounded-2xl text-sm font-bold mb-8 
                            border border-primary/30 backdrop-blur-lg shadow-lg hover:shadow-xl
                            transition-all duration-300 hover:scale-105 interactive-hover-subtle">
              <div className="relative">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Updated for 2025 • Live Data
              </span>
            </div>
          </div>

          {/* Enhanced main heading with better typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black 
                         mb-8 sm:mb-10 text-high-contrast leading-[0.95] tracking-[-0.02em]
                         animate-fade-in" style={{animationDelay: '0.2s'}}>
            <span className="block mb-2">Portugal Golden Visa</span>
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 
                           bg-clip-text text-transparent block">
              Investment Funds
            </span>
          </h1>
          
          {/* Enhanced subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-medium-contrast 
                       mb-10 sm:mb-12 max-w-5xl mx-auto leading-[1.3] font-light
                       animate-fade-in" style={{animationDelay: '0.4s'}}>
            Explore <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
            qualified investment funds</span> for your Portugal Golden Visa application
          </p>

          {/* Enhanced stats with better visual design */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 
                         mb-10 sm:mb-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center gap-3 text-sm sm:text-base text-medium-contrast 
                           bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl 
                           border border-gray-200/50 shadow-lg hover:shadow-xl
                           transition-all duration-300 hover:scale-105 interactive-hover-subtle">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full 
                             shadow-md"></div>
              <span className="font-bold text-gray-800">11+ Verified Funds</span>
            </div>
            <div className="flex items-center gap-3 text-sm sm:text-base text-medium-contrast 
                           bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl 
                           border border-gray-200/50 shadow-lg hover:shadow-xl
                           transition-all duration-300 hover:scale-105 interactive-hover-subtle">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full 
                             shadow-md"></div>
              <span className="font-bold text-gray-800">€500M+ AUM</span>
            </div>
            <div className="flex items-center gap-3 text-sm sm:text-base text-medium-contrast 
                           bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl 
                           border border-gray-200/50 shadow-lg hover:shadow-xl
                           transition-all duration-300 hover:scale-105 interactive-hover-subtle">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full 
                             shadow-md"></div>
              <span className="font-bold text-gray-800">100% Transparent</span>
            </div>
          </div>
          
          {/* Enhanced last updated section */}
          <div className="flex justify-center mb-10 sm:mb-12 animate-fade-in" 
               style={{animationDelay: '0.8s'}} role="complementary">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border border-gray-200/50 
                           shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <LastUpdated />
            </div>
          </div>

          {/* Enhanced CTA section */}
          {!isAuthenticated && (
            <div className="mb-12 sm:mb-16 animate-fade-in" 
                 style={{animationDelay: '1s'}} role="complementary" aria-label="Get expert guidance">
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 
                               rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-white via-white to-gray-50/50 
                               rounded-3xl p-2 shadow-2xl border border-gray-200/50 backdrop-blur-sm">
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
