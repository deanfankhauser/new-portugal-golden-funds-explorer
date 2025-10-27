
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Building2, Euro } from 'lucide-react';
import { Button } from '../ui/button';
import { funds } from '../../data/funds';

const HomepageHero: React.FC = () => {
  const totalFunds = funds.length;
  const minimumInvestment = '€500K';

  const stats = [
    {
      value: `${totalFunds}`,
      label: 'Golden Visa Funds',
      icon: Building2,
    },
    {
      value: 'Comprehensive',
      label: 'Analysis & Comparison',
      icon: TrendingUp,
    },
    {
      value: minimumInvestment,
      label: 'Standard Investment',
      icon: Euro,
    },
    {
      value: 'Updated',
      label: 'Regularly Verified Data',
      icon: ShieldCheck,
    },
  ];

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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent mb-2 sm:mb-3 shrink-0" />
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-high-contrast mb-1 sm:mb-2 break-words hyphens-auto w-full">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-medium-contrast font-medium break-words w-full">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Learn More Link */}
          <div className="text-center">
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
