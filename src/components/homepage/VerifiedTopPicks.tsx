import React from 'react';
import { Fund } from '../../data/types/funds';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

interface VerifiedTopPicksProps {
  funds: Fund[];
}

const VerifiedTopPicks: React.FC<VerifiedTopPicksProps> = ({ funds }) => {
  const navigate = useNavigate();

  // Filter to verified funds and take top 3 by target return
  const topVerifiedFunds = funds
    .filter(fund => fund.isVerified === true)
    .sort((a, b) => {
      const aReturn = a.expectedReturnMax || a.expectedReturnMin || 0;
      const bReturn = b.expectedReturnMax || b.expectedReturnMin || 0;
      return bReturn - aReturn;
    })
    .slice(0, 3);

  if (topVerifiedFunds.length === 0) {
    return null;
  }

  const formatMinimumInvestment = (amount: number | null | undefined): string => {
    if (!amount) return 'Not disclosed';
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    return `€${(amount / 1000).toFixed(0)}K`;
  };

  const formatTargetYield = (fund: Fund): string => {
    if (fund.expectedReturnMax && fund.expectedReturnMin) {
      return `${fund.expectedReturnMin}–${fund.expectedReturnMax}% p.a.`;
    } else if (fund.expectedReturnMin) {
      return `${fund.expectedReturnMin}% p.a.`;
    } else if (fund.expectedReturnMax) {
      return `${fund.expectedReturnMax}% p.a.`;
    }
    return 'Not disclosed';
  };

  // Helper to determine what to show in the second metric row
  const getSecondaryMetric = (fund: Fund): { label: string; value: string } => {
    // If yield is available, show it
    if (fund.expectedReturnMin || fund.expectedReturnMax) {
      return { label: 'Target Yield', value: formatTargetYield(fund) };
    }
    // Fallback: Fund Strategy/Category
    return { label: 'Fund Strategy', value: fund.category || 'Diversified' };
  };

  return (
    <section className="py-12 sm:py-16 bg-card/30">
      <div className="max-w-7xl mx-auto container-responsive-padding">
        <h2 className="text-3xl sm:text-4xl font-bold text-high-contrast text-center mb-12">
          Curated Fund Selections
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {topVerifiedFunds.map((fund) => {
            const secondaryMetric = getSecondaryMetric(fund);
            
            return (
              <div
                key={fund.id}
                className="bg-card border-2 border-accent/20 rounded-xl p-8 shadow-lg hover:shadow-2xl hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Category Pill */}
                {fund.category && (
                  <Badge variant="outline" className="mb-3 text-xs uppercase tracking-wide border-primary/30 text-primary">
                    {fund.category}
                  </Badge>
                )}

                {/* Fund Name */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-high-contrast mb-3">
                    {fund.name}
                  </h3>
                  <Badge className="bg-emerald-600/90 text-white border-emerald-700 hover:bg-emerald-700 flex items-center gap-1.5 w-fit px-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Partner
                  </Badge>
                </div>

              {/* Brief Description */}
              <p className="text-medium-contrast text-sm mb-6 line-clamp-2">
                {fund.description || 'CMVM-regulated Portugal Golden Visa investment fund.'}
              </p>

                {/* Key Metrics */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-sm text-medium-contrast">Minimum Investment</span>
                    <span className="text-base font-semibold text-high-contrast">
                      {formatMinimumInvestment(fund.minimumInvestment)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-sm text-medium-contrast">{secondaryMetric.label}</span>
                    <span className="text-base font-semibold text-high-contrast">
                      {secondaryMetric.value}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => navigate(`/${fund.id}`)}
                  className="w-full bg-[hsl(25,45%,25%)] hover:bg-[hsl(25,45%,20%)] text-white"
                >
                  Analyze Fund
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VerifiedTopPicks;
