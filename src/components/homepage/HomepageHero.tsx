
import React from 'react';
import { Link } from 'react-router-dom';

import PremiumCTA from '../cta/PremiumCTA';
import LastUpdated from '../common/LastUpdated';
import { funds } from '../../data/funds';

const HomepageHero: React.FC = () => {
  // Calculate the most recent update date from all funds
  const getMostRecentUpdateDate = () => {
    const dates = funds
      .map(fund => fund.dateModified || fund.dataLastVerified)
      .filter(Boolean)
      .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime());
    
    return dates[0] || null;
  };

  const mostRecentUpdate = getMostRecentUpdateDate();

  return (
    <header className="mb-12 sm:mb-16 lg:mb-20 max-w-7xl mx-auto container-responsive-padding">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-accent/8 to-accent/3 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-muted/30 to-muted/10 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-full blur-2xl opacity-60"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold 
                         mb-4 sm:mb-6 text-high-contrast leading-[1.1] tracking-tight">
            <span className="block">Portugal Golden Visa</span>
            <span className="text-accent font-bold">
              Investment Funds
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-medium-contrast 
                       mb-6 sm:mb-8 max-w-4xl leading-relaxed font-light mx-auto">
            Explore <span className="font-semibold text-accent">Portugal Golden Visa Investment Funds</span> with 
            comprehensive analysis and compare qualified funds for your Golden Visa application.
          </p>
          
          <div className="mb-8 sm:mb-10">
            <a 
              href="https://movingto.com/pt/portugal-golden-visa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-base sm:text-lg transition-colors duration-200 group"
            >
              Learn about Portugal Golden Visa requirements
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          
          {mostRecentUpdate && (
            <div className="flex justify-center mb-8 sm:mb-10" role="complementary">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-sm">
                <LastUpdated dateModified={mostRecentUpdate} />
              </div>
            </div>
          )}

          <div className="mb-10 sm:mb-12" role="complementary" aria-label="Get expert guidance">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/15 to-accent/5 rounded-3xl blur-xl"></div>
              <div className="relative">
                <PremiumCTA variant="banner" location="homepage-hero" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default HomepageHero;
