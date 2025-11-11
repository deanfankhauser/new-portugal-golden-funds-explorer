import React from 'react';
import { Fund } from '@/data/funds';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MessageSquare, Heart, CheckCircle2 } from 'lucide-react';
import { useSavedFunds } from '@/hooks/useSavedFunds';
import { trackInteraction } from '@/utils/analyticsTracking';
import { Link } from 'react-router-dom';
import { managerToSlug } from '@/lib/utils';

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
  const { isFundSaved, saveFund, unsaveFund } = useSavedFunds();
  const isSaved = isFundSaved(fund.id);

  const handleSaveFund = async () => {
    if (isSaved) {
      await unsaveFund(fund.id);
    } else {
      await saveFund(fund.id);
      trackInteraction(fund.id, 'save_fund');
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
      <CardContent className="p-10">
        {/* Optional Verified Badge */}
        {fund.isVerified && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-semibold mb-4 bg-success/10 text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified Fund
          </div>
        )}

        {/* Manager Section */}
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border/60">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-7 w-7 text-primary" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Managed by</p>
            <Link 
              to={`/manager/${managerToSlug(fund.managerName)}`}
              className="font-semibold text-base text-foreground hover:text-primary transition-colors truncate block leading-tight"
            >
              {fund.managerName}
            </Link>
          </div>
        </div>
        
        {/* Fund Title */}
        <h3 className="font-bold text-foreground text-[28px] leading-tight tracking-tight mb-8 font-heading">
          {fund.name}
        </h3>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-muted/20 border border-border/40 rounded-xl p-4 transition-all duration-150 hover:bg-muted/30 hover:border-border/60">
            <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Min Investment</p>
            <p className="text-2xl font-semibold text-foreground tracking-tight">{formatCurrency(fund.minimumInvestment)}</p>
          </div>
          <div className="bg-muted/20 border border-border/40 rounded-xl p-4 transition-all duration-150 hover:bg-muted/30 hover:border-border/60">
            <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Fund Size</p>
            <p className="text-2xl font-semibold text-foreground tracking-tight">
              {fund.fundSize ? `€${fund.fundSize.toFixed(0)}M` : 'N/A'}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-6">
          <Button 
            onClick={scrollToEnquiry}
            className="w-full gap-2.5 shadow-[0_2px_4px_rgba(75,15,35,0.2)] hover:shadow-[0_4px_8px_rgba(75,15,35,0.25)] hover:translate-y-[-1px] active:translate-y-0 transition-all duration-200 font-semibold text-[15px] h-[52px] rounded-xl"
          >
            <MessageSquare className="h-[18px] w-[18px]" strokeWidth={2} />
            Get in Touch
          </Button>
          
          <Button 
            onClick={handleSaveFund}
            variant="outline"
            className="w-full gap-2.5 hover:bg-muted/20 transition-all duration-200 font-semibold text-[15px] h-[52px] rounded-xl border-border/50 hover:border-border text-muted-foreground hover:text-foreground"
          >
            <Heart className={`h-[18px] w-[18px] transition-colors ${isSaved ? 'fill-current text-primary' : ''}`} strokeWidth={2} />
            {isSaved ? 'Saved' : 'Save Fund'}
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 border-t border-border/60">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Capital at risk. Past performance isn't indicative of future returns. This is not investment advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSidebar;
