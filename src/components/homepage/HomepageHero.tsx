
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Fund } from '../../data/types/funds';

interface HomepageHeroProps {
  funds: Fund[];
}

const HomepageHero: React.FC<HomepageHeroProps> = ({ funds }) => {
  const scrollToFunds = () => {
    const fundsSection = document.getElementById('funds-section');
    if (fundsSection) {
      fundsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="mb-12 sm:mb-16 lg:mb-20 max-w-7xl mx-auto container-responsive-padding">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="relative z-10">
          {/* Trust Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-6 py-3 border border-border shadow-sm">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-high-contrast">
                Expert-Curated Golden Visa Fund Analysis
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-high-contrast leading-[1.1] tracking-tight">
              Portugal Golden Visa Funds
            </h1>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-accent italic font-cheltenham">Profiles, Metrics, Comparisons</span>
            </div>
            
            <p className="text-lg sm:text-xl text-medium-contrast max-w-3xl mx-auto leading-relaxed mb-8">
              Compare Portugal Golden Visa investment funds with comprehensive analysis. 
              Detailed breakdown of fees, returns, and compliance requirements.
            </p>
          </div>

          {/* Learn More Link */}
          <div className="text-center mb-8">
            <a 
              href="https://movingto.com/pt/portugal-golden-visa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm sm:text-base transition-colors duration-200 group"
            >
              Learn about Portugal Golden Visa requirements
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomepageHero;
