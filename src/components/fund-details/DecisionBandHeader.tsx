import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { InfoTip } from '../ui/info-tip';
import { Mail, Calendar, BarChart3, Bookmark, Info } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useShortlist } from '../../contexts/ShortlistContext';
import { formatPercentage } from './utils/formatters';
import { DATA_AS_OF_LABEL } from '../../utils/constants';
import { FundEditButton } from '../fund-editing/FundEditButton';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';
import { calculateRiskScore, getRiskLabel, getRiskColor } from '../../utils/riskCalculation';
import { useAuth } from '../../hooks/useAuth';
import { AuthRequiredModal } from '../fund-editing/AuthRequiredModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FundLogo from './FundLogo';

interface DecisionBandHeaderProps {
  fund: Fund;
}

const DecisionBandHeader: React.FC<DecisionBandHeaderProps> = ({ fund }) => {
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  const { isInShortlist, addToShortlist, removeFromShortlist } = useShortlist();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRequestingBrief, setIsRequestingBrief] = useState(false);
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

  const handleGetFundBrief = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    setIsRequestingBrief(true);

    try {
      const { error } = await supabase.functions.invoke('send-fund-brief', {
        body: {
          userEmail: user.email,
          fundName: fund.name,
          fundId: fund.id,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Fund Brief Requested",
        description: `We'll send the ${fund.name} brief to ${user.email} within 24 hours.`,
      });
    } catch (error: any) {
      console.error('Error requesting fund brief:', error);
      toast({
        title: "Error",
        description: "Failed to request fund brief. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingBrief(false);
    }
  };

  const handleBookCall = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-booking-request', {
        body: { 
          fundName: fund.name,
          userEmail: user?.email 
        }
      });

      if (error) throw error;

      toast({
        title: "Booking Request Sent!",
        description: `We'll contact you shortly to schedule your call about ${fund.name}.`,
      });
    } catch (error) {
      console.error('Error sending booking request:', error);
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive",
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
              <Link to={`/manager/${fund.managerName?.toLowerCase().replace(/\s+/g, '-')}`} className="flex-shrink-0">
                <FundLogo 
                  logoUrl={fund.logoUrl}
                  fundName={fund.name}
                  fundId={fund.id}
                  size="md"
                  className="hover:scale-105 transition-transform duration-200"
                />
              </Link>
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
            <div className="flex flex-col gap-3">
              {/* Primary CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                  onClick={handleGetFundBrief}
                  disabled={isRequestingBrief}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isRequestingBrief ? "Requesting..." : "Get Fund Brief"}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={handleBookCall}
                >
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

      <AuthRequiredModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </div>
  );
};

export default DecisionBandHeader;