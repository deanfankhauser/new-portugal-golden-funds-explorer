import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Mail, Calendar, BarChart3, Bookmark } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useShortlist } from '../../contexts/ShortlistContext';
import { formatPercentage } from './utils/formatters';
import { DATA_AS_OF_LABEL } from '../../utils/constants';

interface DecisionBandHeaderProps {
  fund: Fund;
}

const DecisionBandHeader: React.FC<DecisionBandHeaderProps> = ({ fund }) => {
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  const { isInShortlist, addToShortlist, removeFromShortlist } = useShortlist();
  const isCompared = isInComparison(fund.id);
  const isShortlisted = isInShortlist(fund.id);

  const handleCompareClick = () => {
    if (isCompared) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  const handleShortlistClick = () => {
    if (isShortlisted) {
      removeFromShortlist(fund.id);
    } else {
      addToShortlist(fund);
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

  return (
    <div className="bg-card border-b border-border">
      {/* Header Strip */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left: Fund Name + Thesis */}
          <div className="lg:col-span-1">
            <div className="flex items-start gap-4">
              {fund.logoUrl && (
                <Link to={`/manager/${fund.managerName?.toLowerCase().replace(/\s+/g, '-')}`} className="flex-shrink-0">
                  <img 
                    src={fund.logoUrl} 
                    alt={`${fund.managerName} logo`}
                    className="w-12 h-12 rounded-lg object-contain bg-muted p-1 hover:scale-105 transition-transform duration-200"
                  />
                </Link>
              )}
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-center p-2 text-center cursor-help">
                        <div>
                          <div className="text-xs text-muted-foreground">YTD</div>
                          <div className={`font-semibold ${ytdPerf >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatPercentage(ytdPerf)}
                          </div>
                        </div>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Year-to-Date performance shows how much the fund has gained or lost since the beginning of the current year.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {oneYearPerf !== null && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-center p-2 text-center cursor-help">
                        <div>
                          <div className="text-xs text-muted-foreground">1Y</div>
                          <div className={`font-semibold ${oneYearPerf >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatPercentage(oneYearPerf)}
                          </div>
                        </div>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>1-Year performance shows the total return over the past 12 months.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {sinceInceptionPerf !== null && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-center p-2 text-center cursor-help">
                        <div>
                          <div className="text-xs text-muted-foreground">Since Inception</div>
                          <div className={`font-semibold ${sinceInceptionPerf >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatPercentage(sinceInceptionPerf)}
                          </div>
                        </div>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total performance since the fund was launched. This shows the cumulative return from the fund's start date.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {maxDD !== null && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-center p-2 text-center cursor-help">
                        <div>
                          <div className="text-xs text-muted-foreground">Max DD</div>
                          <div className="font-semibold text-destructive">
                            -{formatPercentage(maxDD)}
                          </div>
                        </div>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum Drawdown is the largest peak-to-trough decline. It shows the worst loss an investor would have experienced during any period.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {volatility !== null && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-center p-2 text-center cursor-help">
                        <div>
                          <div className="text-xs text-muted-foreground">Volatility</div>
                          <div className="font-semibold text-muted-foreground">
                            {formatPercentage(volatility)}
                          </div>
                        </div>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Volatility measures how much the fund's returns fluctuate. Higher volatility means more unpredictable returns.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="justify-center p-2 text-center cursor-help">
                      <div>
                        <div className="text-xs text-muted-foreground">Risk</div>
                        <div className="font-semibold text-muted-foreground">
                          Medium/7
                        </div>
                      </div>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Risk level assessment on a scale of 1-7, where 1 is very low risk and 7 is very high risk. Based on fund characteristics and historical performance.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            
            
            <div className="text-xs text-muted-foreground mt-3 text-center lg:text-left">
              Last updated: {DATA_AS_OF_LABEL}
            </div>
          </div>

          {/* Right: Primary CTAs */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-3">
              {/* Primary CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <Mail className="mr-2 h-4 w-4" />
                  Get Fund Brief
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book 15-min Call
                </Button>
              </div>
              
              {/* Secondary CTAs */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCompareClick}
                  className={isCompared ? "bg-accent text-accent-foreground" : ""}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {isCompared ? "Remove" : "Compare"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShortlistClick}
                  className={isShortlisted ? "bg-accent text-accent-foreground" : ""}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  {isShortlisted ? "Shortlisted" : "Shortlist"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DecisionBandHeader;