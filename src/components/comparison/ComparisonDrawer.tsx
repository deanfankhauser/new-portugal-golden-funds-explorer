import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, TrendingUp, Clock, DollarSign, Percent } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue } from '@/utils/currencyFormatters';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({ isOpen, onClose }) => {
  const { compareFunds, clearComparison } = useComparison();

  if (compareFunds.length < 2) return null;

  const fund1 = compareFunds[0];
  const fund2 = compareFunds[1];

  const getCompareUrl = () => {
    const slug1 = fund1.id;
    const slug2 = fund2.id;
    return `/compare/${slug1}-vs-${slug2}`;
  };

  const formatReturn = (fund: typeof fund1) => {
    if (fund.expectedReturnMin && fund.expectedReturnMax) {
      return `${fund.expectedReturnMin}–${fund.expectedReturnMax}%`;
    }
    if (fund.returnTarget) return fund.returnTarget;
    return '—';
  };

  const formatLockup = (fund: typeof fund1) => {
    if (fund.redemptionTerms?.minimumHoldingPeriod) {
      return `${fund.redemptionTerms.minimumHoldingPeriod} months`;
    }
    return 'None';
  };

  const metrics = [
    {
      label: 'Target IRR',
      icon: TrendingUp,
      value1: formatReturn(fund1),
      value2: formatReturn(fund2),
    },
    {
      label: 'Liquidity / Lock-up',
      icon: Clock,
      value1: formatLockup(fund1),
      value2: formatLockup(fund2),
    },
    {
      label: 'Minimum Investment',
      icon: DollarSign,
      value1: formatCurrencyValue(fund1.minimumInvestment || 0),
      value2: formatCurrencyValue(fund2.minimumInvestment || 0),
    },
    {
      label: 'Management Fee',
      icon: Percent,
      value1: fund1.managementFee ? `${fund1.managementFee}%` : '—',
      value2: fund2.managementFee ? `${fund2.managementFee}%` : '—',
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-l border-border p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold">Quick Comparison</SheetTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Fund Names */}
          <div className="px-6 py-4 bg-muted/30 border-b border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Fund A</span>
                <span className="text-sm font-medium text-foreground line-clamp-2">{fund1.name}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Fund B</span>
                <span className="text-sm font-medium text-foreground line-clamp-2">{fund2.name}</span>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <metric.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="font-mono text-sm font-medium text-foreground">
                      {metric.value1}
                    </div>
                    <div className="font-mono text-sm font-medium text-foreground">
                      {metric.value2}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-border bg-muted/30 space-y-3">
            <Link to={getCompareUrl()} onClick={onClose}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <span>View Full Comparison</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                clearComparison();
                onClose();
              }}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ComparisonDrawer;
