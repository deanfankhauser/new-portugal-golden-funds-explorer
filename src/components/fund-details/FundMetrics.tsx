
import React, { useState } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../../contexts/AuthContext';
import { ContentGatingService } from '../../services/contentGatingService';
import LazyPasswordDialog from '../common/LazyPasswordDialog';
import FeeDisclaimer from './FeeDisclaimer';
import { Lock, Eye } from 'lucide-react';

interface FundMetricsProps {
  fund: Fund;
  formatCurrency: (amount: number) => string;
  formatFundSize?: () => React.ReactNode;
}

interface MetricItem {
  label: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  isPublic: boolean;
}

const FundMetrics: React.FC<FundMetricsProps> = ({ fund, formatCurrency, formatFundSize }) => {
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

  // Always show basic public metrics
  const publicMetrics: MetricItem[] = [
    {
      label: "Minimum Investment",
      value: fund.minimumInvestment <= 0 ? "Not provided" : formatCurrency(fund.minimumInvestment),
      subtitle: fund.id === '3cc-golden-income' ? 'Class A (€300,000 for Class D)' : undefined,
      isPublic: true
    },
    {
      label: "Target Return", 
      value: `${fund.returnTarget} (as of Aug 2025)`,
      isPublic: true
    },
    {
      label: "Fund Size",
      value: formatFundSize ? formatFundSize() : `${fund.fundSize} Million EUR`,
      isPublic: true
    },
    {
      label: "Term",
      value: fund.term === 0 ? "Perpetual (open-ended)" : `${fund.term} years`,
      isPublic: true
    }
  ];

  // Additional metrics that may be gated
  const additionalMetrics: MetricItem[] = [
    {
      label: "Established",
      value: fund.id === '3cc-golden-income' ? 'April 2025' : fund.established,
      isPublic: true
    },
    {
      label: "Regulated By",
      value: fund.regulatedBy,
      isPublic: true
    },
    {
      label: "Location",
      value: fund.location,
      isPublic: true
    }
  ];

  const allMetrics = [...publicMetrics, ...additionalMetrics];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {allMetrics.map((metric) => (
          <Card key={`${metric.label}-${metric.value}`} className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <h3 className="font-medium text-muted-foreground mb-1 md:mb-2 text-xs md:text-sm uppercase tracking-wide">
                {metric.label}
              </h3>
              <p className="text-lg md:text-2xl font-bold text-primary leading-tight">
                {metric.value}
              </p>
              {metric.subtitle && (
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{metric.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <FeeDisclaimer />

      {!isAuthenticated && (
        <div className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 p-4 md:p-6 rounded-lg border border-primary/20">
          <div className="text-center">
            <Lock className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Advanced Fund Analytics Available</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Get access to detailed performance metrics, risk analysis, and portfolio allocation data
            </p>
            <Button 
              onClick={handleUnlockClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Advanced Analytics
            </Button>
          </div>
        </div>
      )}

      <LazyPasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundMetrics;
