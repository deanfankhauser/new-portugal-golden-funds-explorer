
import React from 'react';
import { Link } from 'react-router-dom';
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
            <span className="text-primary font-bold">
              Investment Funds
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-medium-contrast 
                       mb-6 sm:mb-8 max-w-4xl leading-relaxed font-light mx-auto">
            Explore <span className="font-semibold text-primary">Portugal Golden Visa Investment Funds</span> with 
            comprehensive analysis and compare qualified funds for your Golden Visa application. Access our 
            <Link to="/index" className="text-primary hover:text-primary/80 font-medium underline">
              complete fund database
            </Link> for detailed rankings and comparisons.
          </p>
          
          <div className="mb-8 sm:mb-10">
            <a 
              href="https://movingto.com/pt/portugal-golden-visa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-base sm:text-lg transition-colors duration-200 group"
            >
              Learn about Portugal Golden Visa requirements
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          
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
