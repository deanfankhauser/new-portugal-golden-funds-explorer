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
    <Card className="sticky top-24 h-fit shadow-lg border-2 hidden lg:block">
      <CardContent className="p-6 space-y-6">
        {/* Fund Manager Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Managed by</p>
              <Link 
                to={`/manager/${managerToSlug(fund.managerName)}`}
                className="font-semibold text-foreground hover:text-accent transition-colors truncate block"
              >
                {fund.managerName}
              </Link>
            </div>
          </div>
          
          {/* Fund Name */}
          <div className="pt-3 border-t">
            <h3 className="font-medium text-foreground line-clamp-2 leading-snug">
              {fund.name}
            </h3>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Min Investment</p>
            <p className="text-sm font-semibold">{formatCurrency(fund.minimumInvestment)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Fund Size</p>
            <p className="text-sm font-semibold">
              {fund.fundSize ? `€${fund.fundSize.toFixed(0)}M` : 'N/A'}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-3 border-t">
          <Button 
            onClick={scrollToEnquiry}
            className="w-full gap-2 shadow-md"
            size="lg"
          >
            <MessageSquare className="h-5 w-5" />
            Get in Touch
          </Button>
          
          <Button 
            onClick={handleSaveFund}
            variant="outline"
            className="w-full gap-2"
            size="lg"
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-current text-primary' : ''}`} />
            {isSaved ? 'Saved' : 'Save Fund'}
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground pt-3 border-t leading-relaxed">
          Capital at risk. Past performance isn't indicative of future returns. This is not investment advice.
        </p>
      </CardContent>
    </Card>
  );
};

export default ContactSidebar;
