import React, { useState } from 'react';
import { Fund } from '@/data/types/funds';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSavedFunds } from '@/hooks/useSavedFunds';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { trackInteraction } from '@/utils/analyticsTracking';
import { Link } from 'react-router-dom';
import { managerToSlug } from '@/lib/utils';
import { getReturnTargetDisplay } from '@/utils/returnTarget';
import { useToast } from '@/hooks/use-toast';
import { CompanyLogo } from '../shared/CompanyLogo';

interface ContactSidebarProps {
  fund: Fund;
}

const scrollToEnquiry = () => {
  const element = document.getElementById('enquiry-form');
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      const firstInput = element.querySelector('input');
      firstInput?.focus();
    }, 500);
  }
};

const ContactSidebar: React.FC<ContactSidebarProps> = ({ fund }) => {
  const { user } = useEnhancedAuth();
  const { toast } = useToast();
  const { isFundSaved, saveFund, unsaveFund } = useSavedFunds();
  const isSaved = isFundSaved(fund.id);
  
  const [optimisticSaved, setOptimisticSaved] = useState(false);

  const displaySaved = optimisticSaved || isSaved;

  const handleSaveFund = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('💾 Save button clicked', { fundId: fund.id, isSaved, user: !!user });

    if (!user) {
      toast({
        title: 'Please sign in to add funds to your watchlist',
        variant: 'destructive'
      });
      return;
    }

    // Immediate optimistic update
    const newSavedState = !displaySaved;
    setOptimisticSaved(newSavedState);
    console.log(`${newSavedState ? '💾' : '🗑️'} Optimistic update: ${newSavedState ? 'Saved' : 'Unsaved'}`);

    // Fire-and-forget background operation
    if (newSavedState) {
      saveFund(fund.id)
        .then(success => {
          if (!success) {
            console.error('❌ Save failed');
            setOptimisticSaved(isSaved); // Revert
          }
        })
        .catch(error => {
          console.error('❌ Save error:', error);
          setOptimisticSaved(isSaved); // Revert
        });
      
      // Track interaction (fire-and-forget)
      trackInteraction(fund.id, 'save_fund');
    } else {
      unsaveFund(fund.id)
        .then(success => {
          if (!success) {
            console.error('❌ Unsave failed');
            setOptimisticSaved(isSaved); // Revert
          }
        })
        .catch(error => {
          console.error('❌ Unsave error:', error);
          setOptimisticSaved(isSaved); // Revert
        });
    }
  };

  const formatCurrency = (amount: number | undefined | null): string => {
    if (!amount || amount === 0) return 'Contact';
    if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
    return `€${amount.toFixed(0)}`;
  };

  return (
    <Card className="sticky top-24 h-fit shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] border border-border/40 rounded-2xl hidden lg:block overflow-hidden">
      <CardContent className="p-7">
        {/* Optional Verified Badge */}
        {fund.isVerified && (
          <Link to="/verification-program" className="hover:opacity-80 transition-opacity">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-semibold mb-3 bg-success/10 text-success">
              Verified Fund
            </div>
          </Link>
        )}

        {/* Manager Section */}
        <div className="pb-5 mb-5 border-b border-border/60">
          <p className="text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Managed by</p>
          <Link 
            to={`/manager/${managerToSlug(fund.managerName)}`}
            className="flex items-center gap-3 group"
          >
            <CompanyLogo managerName={fund.managerName} size="sm" />
            <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors leading-tight">
              {fund.managerName}
            </span>
          </Link>
        </div>
        
        {/* Fund Title */}
        <h3 className="font-bold text-foreground text-xl md:text-2xl leading-tight tracking-tight mb-6 font-heading">
          {fund.name}
        </h3>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-muted/20 border border-border/40 rounded-xl p-3 transition-all duration-150 hover:bg-muted/30 hover:border-border/60">
            <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Min Investment</p>
            <p className="text-base font-semibold text-foreground tracking-tight">{formatCurrency(fund.minimumInvestment)}</p>
          </div>
          {getReturnTargetDisplay(fund) && (
            <div className="bg-muted/20 border border-border/40 rounded-xl p-3 transition-all duration-150 hover:bg-muted/30 hover:border-border/60">
              <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Target Return</p>
              <p className="text-base font-semibold text-foreground tracking-tight">
                {getReturnTargetDisplay(fund)}
              </p>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2.5">
          <Button 
            type="button"
            onClick={scrollToEnquiry}
            className="w-full shadow-[0_2px_4px_rgba(75,15,35,0.2)] hover:shadow-[0_4px_8px_rgba(75,15,35,0.25)] hover:translate-y-[-1px] active:translate-y-0 transition-all duration-200 font-semibold text-sm h-12 lg:h-11 rounded-xl"
          >
            Get in Touch
          </Button>
          
          <Button 
            type="button"
            onClick={handleSaveFund}
            variant="outline"
            className="w-full hover:bg-muted/20 transition-all duration-200 font-semibold text-sm h-12 lg:h-11 rounded-xl border-border/50 hover:border-border text-muted-foreground hover:text-foreground"
            aria-pressed={displaySaved}
          >
            {displaySaved ? 'On watchlist' : 'Add to watchlist'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSidebar;
