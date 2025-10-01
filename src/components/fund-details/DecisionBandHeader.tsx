import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { InfoTip } from '../ui/info-tip';
import { Phone, BarChart3, ExternalLink, Share2 } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { formatPercentage } from './utils/formatters';
import { DATA_AS_OF_LABEL } from '../../utils/constants';
import { FundEditButton } from '../fund-editing/FundEditButton';
import { buildBookingUrl, buildShareUrl, openExternalLink } from '../../utils/urlHelpers';
import { calculateRiskScore, getRiskLabel, getRiskColor } from '../../utils/riskCalculation';
import analytics from '../../utils/analytics';

interface DecisionBandHeaderProps {
  fund: Fund;
}

const DecisionBandHeader: React.FC<DecisionBandHeaderProps> = ({ fund }) => {
  const { isInComparison, addToComparison } = useComparison();
  const isCompared = isInComparison(fund.id);

  const handleCompareClick = () => {
    addToComparison(fund);
    analytics.trackEvent('add_to_comparison', {
      fund_id: fund.id,
      fund_name: fund.name,
      source: 'decision_band'
    });
  };

  const handleBookCall = () => {
    const bookingUrl = buildBookingUrl(fund.id, fund.name);
    openExternalLink(bookingUrl);
    analytics.trackCTAClick('decision_band', 'book_call', bookingUrl);
  };

  const handleShareWithPartner = () => {
    const fundUrl = window.location.href;
    const shareUrl = buildShareUrl(fund.name, fundUrl, fund.description);
    window.location.href = shareUrl;
    analytics.trackEvent('share_fund', {
      fund_id: fund.id,
      fund_name: fund.name,
      source: 'decision_band'
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      analytics.trackEvent('anchor_click', {
        fund_id: fund.id,
        section: sectionId,
        source: 'decision_band'
      });
    }
  };

  // Calculate key metrics
  const getYTDPerformance = () => {
    if (!fund.historicalPerformance) return null;
    const currentYear = new Date().getFullYear();
    const ytdData = Object.entries(fund.historicalPerformance)
      .filter(([date]) => date.startsWith(currentYear.toString()))
      .map(([, data]) => data.returns);
    if (ytdData.length === 0) return null;
    return ytdData[ytdData.length - 1];
  };

  const get1YPerformance = () => {
    if (!fund.historicalPerformance) return null;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearData = Object.entries(fund.historicalPerformance)
      .filter(([date]) => new Date(date) >= oneYearAgo)
      .map(([, data]) => data.returns);
    if (oneYearData.length === 0) return null;
    return oneYearData[oneYearData.length - 1] - oneYearData[0];
  };

  const getSinceInceptionPerformance = () => {
    if (!fund.historicalPerformance) return null;
    const entries = Object.entries(fund.historicalPerformance);
    if (entries.length === 0) return null;
    const first = entries[0][1].returns;
    const last = entries[entries.length - 1][1].returns;
    return last - first;
  };

  const getMaxDrawdown = () => {
    if (!fund.historicalPerformance) return null;
    const returns = Object.values(fund.historicalPerformance).map(data => data.returns);
    let maxDD = 0;
    let peak = returns[0];
    
    for (const value of returns) {
      if (value > peak) peak = value;
      const drawdown = (peak - value) / peak * 100;
      if (drawdown > maxDD) maxDD = drawdown;
    }
    return maxDD;
  };

  const getVolatility = () => {
    if (!fund.historicalPerformance) return null;
    const returns = Object.values(fund.historicalPerformance).map(data => data.returns);
    if (returns.length < 2) return null;
    
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (returns.length - 1);
    return Math.sqrt(variance);
  };

  const ytdPerf = getYTDPerformance();
  const oneYearPerf = get1YPerformance();
  const sinceInceptionPerf = getSinceInceptionPerformance();
  const maxDD = getMaxDrawdown();
  const volatility = getVolatility();
  
  // Calculate actual risk score
  const riskScore = calculateRiskScore(fund);
  const riskLabel = getRiskLabel(riskScore);
  const riskColor = getRiskColor(riskScore);

  return (
    <div className="bg-card border-b border-border">
      {/* Header Strip */}
      <div className="container mx-auto px-4 py-6">
        {/* Top row with Edit button */}
        <div className="flex justify-end mb-6">
          <FundEditButton fund={fund} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left: Fund Name + Thesis */}
          <div className="lg:col-span-1">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                  {fund.name}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {fund.description || "Investment opportunity focused on generating sustainable returns."}
                </p>
                {fund.managerName && (
                  <Link 
                    to={`/manager/${fund.managerName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-primary hover:text-primary/80 font-medium mt-1 inline-block transition-colors"
                  >
                    by {fund.managerName} →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Center: Primary KPIs */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                {ytdPerf !== null && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="justify-center p-2 text-center flex-1">
                      <div>
                        <div className="text-xs text-muted-foreground">YTD</div>
                        <div className={`font-semibold ${ytdPerf >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatPercentage(ytdPerf)}
                        </div>
                      </div>
                    </Badge>
                    <InfoTip content="Since start of year" iconSize={12} />
                  </div>
                )}
                
                {oneYearPerf !== null && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="justify-center p-2 text-center flex-1">
                      <div>
                        <div className="text-xs text-muted-foreground">1Y</div>
                        <div className={`font-semibold ${oneYearPerf >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatPercentage(oneYearPerf)}
                        </div>
                      </div>
                    </Badge>
                    <InfoTip content="Past 12 months" iconSize={12} />
                  </div>
                )}
                
                {sinceInceptionPerf !== null && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="justify-center p-2 text-center flex-1">
                      <div>
                        <div className="text-xs text-muted-foreground">Since Inception</div>
                        <div className={`font-semibold ${sinceInceptionPerf >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatPercentage(sinceInceptionPerf)}
                        </div>
                      </div>
                    </Badge>
                    <InfoTip content="Since fund launch" iconSize={12} />
                  </div>
                )}
                
                {maxDD !== null && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="justify-center p-2 text-center flex-1">
                      <div>
                        <div className="text-xs text-muted-foreground">Max DD</div>
                        <div className="font-semibold text-destructive">
                          -{formatPercentage(maxDD)}
                        </div>
                      </div>
                    </Badge>
                    <InfoTip content="Peak-to-trough decline" iconSize={12} />
                  </div>
                )}
                
                {volatility !== null && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="justify-center p-2 text-center flex-1">
                      <div>
                        <div className="text-xs text-muted-foreground">Volatility</div>
                        <div className="font-semibold text-muted-foreground">
                          {formatPercentage(volatility)}
                        </div>
                      </div>
                    </Badge>
                    <InfoTip content="Return fluctuation" iconSize={12} />
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                </div>
              </div>
            
            
            <div className="text-xs text-muted-foreground mt-3 text-center lg:text-left">
              Last updated: {DATA_AS_OF_LABEL}
            </div>
          </div>

          {/* Right: Primary CTAs */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-4">
              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg"
                  onClick={handleBookCall}
                  className="flex-1 sm:flex-initial"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Book 15-min Call
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  onClick={handleCompareClick}
                  className="flex-1 sm:flex-initial"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  {isCompared ? "In Compare" : "Add to Compare"}
                </Button>
              </div>
              
              {/* Tertiary CTAs: Anchor Links */}
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <button
                  onClick={() => scrollToSection('financial-details')}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  See Fees & Risks
                  <ExternalLink className="h-3 w-3" />
                </button>
                <span className="text-muted-foreground/50">·</span>
                <button
                  onClick={() => scrollToSection('fund-overview')}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  See Portfolio & Thesis
                  <ExternalLink className="h-3 w-3" />
                </button>
                <span className="text-muted-foreground/50">·</span>
                <button
                  onClick={handleShareWithPartner}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <Share2 className="h-3 w-3" />
                  Share with Partner
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DecisionBandHeader;
