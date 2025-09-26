import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Mail, Calendar, BarChart3, Bookmark } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useShortlist } from '../../contexts/ShortlistContext';
import { calculateRiskScore, getRiskLabel, getRiskColor } from '../../utils/riskCalculation';
import { useAuth } from '../../hooks/useAuth';
import { AuthRequiredModal } from '../fund-editing/AuthRequiredModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FundLogo from './FundLogo';
import FundSnapshotCard from './FundSnapshotCard';
import { FundEditButton } from '../fund-editing/FundEditButton';
import { managerToSlug } from '../../lib/utils';

interface FundHeroSnapshotProps {
  fund: Fund;
}

const FundHeroSnapshot: React.FC<FundHeroSnapshotProps> = ({ fund }) => {
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  const { isInShortlist, addToShortlist, removeFromShortlist } = useShortlist();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRequestingBrief, setIsRequestingBrief] = useState(false);
  
  const isCompared = isInComparison(fund.id);
  const isShortlisted = isInShortlist(fund.id);

  // Calculate risk score and get risk styling
  const riskScore = calculateRiskScore(fund);
  const riskLabel = getRiskLabel(riskScore);
  const riskColor = getRiskColor(riskScore);

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
      const { data, error } = await supabase.functions.invoke('send-fund-brief', {
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
      
      const errorMessage = error?.message || '';
      const isNoFundBriefError = errorMessage.includes('No fund brief available') || 
                                errorMessage.includes('No fund brief URL found');
      
      toast({
        title: "Error",
        description: isNoFundBriefError 
          ? "This fund doesn't have a brief document available yet." 
          : "Failed to request fund brief. Please try again.",
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

  return (
    <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"></div>
      
      <div className="relative container mx-auto px-4 py-12">
        {/* Edit button */}
        <div className="flex justify-end mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <FundEditButton fund={fund} />
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

              {/* Risk Level Badge */}
              <div className="flex items-center gap-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-sm font-medium text-white">Risk Level:</span>
                  <Badge 
                    variant={riskScore <= 3 ? "success" : riskScore <= 6 ? "warning" : "destructive"}
                    className="ml-2 font-semibold"
                  >
                    {riskLabel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  variant={fund.fundBriefUrl ? "default" : "secondary"}
                  className={`font-semibold ${!fund.fundBriefUrl ? 'bg-white/20 text-white/70 cursor-not-allowed hover:bg-white/20' : 'bg-white text-primary hover:bg-white/90'}`}
                  onClick={fund.fundBriefUrl ? handleGetFundBrief : undefined}
                  disabled={isRequestingBrief || !fund.fundBriefUrl}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  {isRequestingBrief ? "Requesting..." : fund.fundBriefUrl ? "Get Fund Brief" : "No Brief Available"}
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm font-semibold"
                  onClick={handleBookCall}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book 15-min Call
                </Button>
              </div>
              
              {/* Secondary CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCompareClick}
                  className={`${isCompared ? "bg-white/20 text-white font-medium" : "text-white/90 hover:bg-white/15 hover:text-white"} flex-1 border border-white/20`}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {isCompared ? "Remove from Compare" : "Add to Compare"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShortlistClick}
                  className={`${isShortlisted ? "bg-white/20 text-white font-medium" : "text-white/90 hover:bg-white/15 hover:text-white"} flex-1 border border-white/20`}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  {isShortlisted ? "Shortlisted" : "Add to Shortlist"}
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

      <AuthRequiredModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </div>
  );
};

export default FundHeroSnapshot;