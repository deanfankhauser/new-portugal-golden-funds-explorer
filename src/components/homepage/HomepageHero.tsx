
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Fund } from '../../data/types/funds';
import { Button } from '../ui/button';

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
                Verified Market Analysis
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-high-contrast leading-[1.1] tracking-tight">
              Portugal Golden Visa Investment Funds
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-high-contrast">
              <span className="text-accent italic font-cheltenham">Compare Fees, Performance, and Risk.</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-medium-contrast max-w-3xl mx-auto leading-relaxed mb-8">
              Access the definitive directory of {funds.length >= 20 ? `${funds.length}+` : funds.length} CMVM-regulated golden visa funds. We verify track records and expose hidden management fees to help you shortlist funds.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="text-center mb-8 space-y-4">
            <div>
              <Button 
                asChild
                size="lg"
                className="bg-[hsl(25,45%,25%)] hover:bg-[hsl(25,45%,20%)] text-white font-semibold px-8 py-6 text-lg"
              >
                <Link to="/fund-matcher">Find My Fund Match</Link>
              </Button>
            </div>
            <div>
              <button 
                onClick={scrollToFunds}
                className="inline-flex items-center text-medium-contrast hover:text-high-contrast font-medium text-base transition-colors duration-200 group"
              >
                or Browse the Complete Golden Visa Fund Directory ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomepageHero;
