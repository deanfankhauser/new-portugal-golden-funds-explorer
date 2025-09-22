import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, GitCompare, Mail, Calendar } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Fund } from '../../data/types/funds';

interface StickyNavigationProps {
  fund: Fund;
}

const StickyNavigation: React.FC<StickyNavigationProps> = ({ fund }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRequestingBrief, setIsRequestingBrief] = useState(false);
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const isComparing = isInComparison(fund.id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 400); // Show after scrolling past decision band
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCompareClick = () => {
    if (isComparing) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  const handleGetFundBrief = async () => {
    if (!isAuthenticated || !user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request fund brief",
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
    if (!isAuthenticated || !user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a call",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-booking-request', {
        body: { 
          fundName: fund.name,
          userEmail: user.email 
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

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Sticky Header */}
      <div className="hidden md:block fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 transition-all duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-foreground truncate max-w-md">
                {fund.name}
              </h2>
              <div className="flex items-center space-x-2">
                {fund.historicalPerformance?.sinceInception?.returns && (
                  <span className="text-sm px-2 py-1 bg-muted rounded-md">
                    SI: {fund.historicalPerformance.sinceInception.returns.toFixed(1)}%
                  </span>
                )}
                {fund.historicalPerformance?.ytd?.returns && (
                  <span className="text-sm px-2 py-1 bg-muted rounded-md">
                    YTD: {fund.historicalPerformance.ytd.returns > 0 ? '+' : ''}{fund.historicalPerformance.ytd.returns.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompareClick}
                className="flex items-center"
              >
                <GitCompare className="w-4 h-4 mr-1" />
                {isComparing ? 'Remove' : 'Compare'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGetFundBrief}
                disabled={isRequestingBrief}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4 mr-1" />
                {isRequestingBrief ? "Requesting..." : "Get Fund Brief"}
              </Button>
              
              <Button 
                size="sm"
                onClick={handleBookCall}
              >
                Book Call
                <Calendar className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40 p-4">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGetFundBrief}
            disabled={isRequestingBrief}
          >
            <Mail className="w-4 h-4 mr-1" />
            {isRequestingBrief ? "Requesting..." : "Get Brief"}
          </Button>
          
          <Button 
            className="flex-1"
            onClick={handleBookCall}
          >
            Book Call
            <Calendar className="w-4 h-4 ml-1" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleCompareClick}
            className={isComparing ? "bg-primary text-primary-foreground" : ""}
          >
            {isComparing ? <Plus className="w-4 h-4 rotate-45" /> : <GitCompare className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default StickyNavigation;