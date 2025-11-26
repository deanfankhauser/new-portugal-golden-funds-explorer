import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrustIndicators: React.FC = () => {
  const indicators = [
    'CMVM Registration Checked',
    'Management History Vetted',
    'Custodian Confirmed'
  ];

  return (
    <Link to="/verification-program" className="block">
      <section className="py-6 sm:py-8 bg-emerald-50/50 dark:bg-emerald-900/10 border-y border-border hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
        <div className="max-w-7xl mx-auto container-responsive-padding">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-high-contrast tracking-wider uppercase">
                Our Verification Process:
              </span>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-accent font-medium">
                <span>Read Methodology</span>
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {indicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-medium-contrast">
                    {indicator}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold text-high-contrast tracking-wider uppercase whitespace-nowrap">
                Our Verification Process:
              </span>
              <div className="flex items-center gap-6">
                {indicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-medium-contrast whitespace-nowrap">
                      {indicator}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-accent font-medium whitespace-nowrap">
              <span>Read Methodology</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
};

export default TrustIndicators;
