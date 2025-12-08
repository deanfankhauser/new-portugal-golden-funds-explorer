import React from 'react';
import { Fund } from '../../data/types/funds';
import { getFundType } from '../../utils/fundTypeUtils';
import { Card, CardContent } from "@/components/ui/card";
import FeeDisclaimer from './FeeDisclaimer';
import { DATA_AS_OF_LABEL } from '../../utils/constants';
import { getReturnTargetDisplay } from '../../utils/returnTarget';
import { formatManagementFee, formatPerformanceFee, formatSubscriptionFee, formatRedemptionFee } from '../../utils/feeFormatters';

interface FundMetricsProps {
  fund: Fund;
  formatCurrency: (amount: number) => string;
  formatFundSize?: () => React.ReactNode;
}

interface MetricItem {
  label: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
}

const FundMetrics: React.FC<FundMetricsProps> = ({ fund, formatCurrency, formatFundSize }) => {
  const targetReturn = getReturnTargetDisplay(fund);
  
  const metrics: MetricItem[] = [
    {
      label: "Minimum Investment",
      value: fund.minimumInvestment && fund.minimumInvestment > 0 ? formatCurrency(fund.minimumInvestment) : null,
    },
    // Only include target return if it exists and is meaningful
    ...(targetReturn ? [{
      label: "Target Return", 
      value: `${targetReturn} ${DATA_AS_OF_LABEL}`,
    }] : []),
    {
      label: "Fund Size",
      value: formatFundSize ? formatFundSize() : (fund.fundSize ? `${fund.fundSize} Million EUR` : null),
    },
    {
      label: "Management Fee",
      value: formatManagementFee(fund.managementFee),
    },
    {
      label: "Performance Fee",
      value: formatPerformanceFee(fund.performanceFee),
    },
    {
      label: "Term",
      value: getFundType(fund) === 'Open-Ended' ? "Perpetual" : (fund.term ? `${fund.term} years` : null),
    },
    {
      label: "Established",
      value: fund.established || null,
    }
  ].filter(metric => metric.value !== null && metric.value !== 'Not disclosed');

  if (fund.subscriptionFee !== undefined) {
    metrics.push({
      label: "Subscription Fee",
      value: formatSubscriptionFee(fund.subscriptionFee)
    });
  }

  if (fund.redemptionFee !== undefined) {
    metrics.push({
      label: "Redemption Fee",
      value: formatRedemptionFee(fund.redemptionFee)
    });
  }

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Fund Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm text-muted-foreground font-medium">{metric.label}</div>
              <div className="text-base font-semibold text-foreground">{metric.value}</div>
              {metric.subtitle && (
                <div className="text-xs text-muted-foreground">{metric.subtitle}</div>
              )}
            </div>
          ))}
        </div>
        <FeeDisclaimer />
      </CardContent>
    </Card>
  );
};

export default FundMetrics;