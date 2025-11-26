
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
              <span className="text-sm font-medium text-high-contrast tracking-[0.15em] uppercase">
                Independent Market Analysis
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-high-contrast leading-[1.1] tracking-tight">
              Portugal Golden Visa Investment Funds
            </h1>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-accent italic font-cheltenham">Compare Fees, Performance, and Risk.</span>
            </div>
            
            <p className="text-lg sm:text-xl text-medium-contrast max-w-3xl mx-auto leading-relaxed mb-8">
              The only independent directory of CMVM-regulated investment funds eligible for the Portugal Golden Visa. We analyze the market to help you compare strategies, scrutinize management fees, and verify track records. Use our data to shortlist the best funds before you invest.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-8">
            <button 
              onClick={scrollToFunds}
              className="inline-flex items-center text-accent hover:text-accent/80 font-semibold text-base sm:text-lg transition-colors duration-200 group"
            >
              Compare All Portugal Funds
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomepageHero;
