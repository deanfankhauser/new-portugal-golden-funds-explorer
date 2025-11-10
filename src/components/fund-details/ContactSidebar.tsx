import React from 'react';
import { Fund } from '@/data/funds';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MessageSquare, Heart } from 'lucide-react';
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
    <Card className="sticky top-24 h-fit shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-border/60 hidden lg:block overflow-hidden">
      <CardContent className="p-0">
        {/* Fund Manager Section */}
        <div className="p-6 pb-5 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/20">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Managed by</p>
              <Link 
                to={`/manager/${managerToSlug(fund.managerName)}`}
                className="font-semibold text-base text-foreground hover:text-primary transition-colors truncate block leading-tight"
              >
                {fund.managerName}
              </Link>
            </div>
          </div>
          
          {/* Fund Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 leading-snug text-base">
            {fund.name}
          </h3>
        </div>

        {/* Quick Stats */}
        <div className="px-6 py-5 bg-muted/20">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Min Investment</p>
              <p className="text-base font-bold text-foreground">{formatCurrency(fund.minimumInvestment)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Fund Size</p>
              <p className="text-base font-bold text-foreground">
                {fund.fundSize ? `€${fund.fundSize.toFixed(0)}M` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="p-6 space-y-3">
          <Button 
            onClick={scrollToEnquiry}
            className="w-full gap-2 shadow-sm hover:shadow-md transition-all duration-300 font-semibold h-12"
          >
            <MessageSquare className="h-5 w-5" />
            Get in Touch
          </Button>
          
          <Button 
            onClick={handleSaveFund}
            variant="outline"
            className="w-full gap-2 hover:bg-muted/50 transition-all duration-300 font-medium h-12 border-border/60"
          >
            <Heart className={`h-5 w-5 transition-colors ${isSaved ? 'fill-current text-primary' : ''}`} />
            {isSaved ? 'Saved' : 'Save Fund'}
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="px-6 pb-6 pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Capital at risk. Past performance isn't indicative of future returns. This is not investment advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSidebar;
