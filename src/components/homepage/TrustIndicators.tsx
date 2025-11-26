import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const TrustIndicators: React.FC = () => {
  const indicators = [
    'CMVM Registration Checked',
    'Management History Vetted',
    'Custodian Confirmed'
  ];

  return (
    <section className="py-8 bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto container-responsive-padding">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <span className="text-sm font-semibold text-high-contrast tracking-wider uppercase">
            Our Verification Process:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {indicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-sm text-medium-contrast whitespace-nowrap">
                  {indicator}
                </span>
                {index < indicators.length - 1 && (
                  <span className="hidden sm:inline text-medium-contrast mx-2">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
