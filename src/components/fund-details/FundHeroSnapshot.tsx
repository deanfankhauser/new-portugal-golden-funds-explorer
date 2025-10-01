import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from '../ui/button';
import { Phone, BarChart3 } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { calculateRiskScore, getRiskLabel, getRiskColor } from '../../utils/riskCalculation';
import { buildBookingUrl, openExternalLink } from '../../utils/urlHelpers';
import analytics from '../../utils/analytics';
import FundSnapshotCard from './FundSnapshotCard';
import { FundEditButton } from '../fund-editing/FundEditButton';
import { managerToSlug } from '../../lib/utils';

interface FundHeroSnapshotProps {
  fund: Fund;
}

const FundHeroSnapshot: React.FC<FundHeroSnapshotProps> = ({ fund }) => {
  const { isInComparison, addToComparison } = useComparison();
  const isCompared = isInComparison(fund.id);

  // Calculate risk score and get risk styling
  const riskScore = calculateRiskScore(fund);
  const riskLabel = getRiskLabel(riskScore);
  const riskColor = getRiskColor(riskScore);

  const handleCompareClick = () => {
    addToComparison(fund);
    analytics.trackEvent('add_to_comparison', {
      fund_id: fund.id,
      fund_name: fund.name,
      source: 'hero_snapshot'
    });
  };

  const handleBookCall = () => {
    const bookingUrl = buildBookingUrl(fund.id, fund.name);
    openExternalLink(bookingUrl);
    analytics.trackCTAClick('hero_snapshot', 'book_call', bookingUrl);
  };

  return (
    <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden rounded-[10px]">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"></div>
      
      <div className="relative container mx-auto px-4 py-12">
        {/* Edit button */}
        <div className="flex justify-end mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
            <FundEditButton 
              fund={fund} 
              variant="ghost"
              className="text-white hover:bg-white/20 hover:text-white border-white/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Fund Identity & Actions */}
          <div className="space-y-8">
            {/* Fund Identity */}
              <div className="space-y-6">
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-white">
                    {fund.name}
                  </h1>
                  <p className="text-base md:text-lg text-white/90 leading-relaxed mb-4">
                    {fund.description || "Investment opportunity focused on generating sustainable returns through strategic market positioning."}
                  </p>
                  {fund.managerName && (
                    <Link 
                      to={`/manager/${managerToSlug(fund.managerName)}`}
                      className="inline-flex items-center text-lg text-white hover:text-accent-foreground font-medium transition-colors"
                    >
                      <span className="mr-2">Managed by</span>
                      <span className="underline underline-offset-4 text-accent-foreground">{fund.managerName}</span>
                      <span className="ml-2">→</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Primary CTAs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold"
                  onClick={handleBookCall}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Book 30-min Call
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm font-semibold"
                  onClick={handleCompareClick}
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  {isCompared ? "In Compare" : "Add to Compare"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Fund Snapshot Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <FundSnapshotCard fund={fund} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundHeroSnapshot;
