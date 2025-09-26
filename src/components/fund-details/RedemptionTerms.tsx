
import React from 'react';
import { ClockAlert } from 'lucide-react';
import { RedemptionTerms as RedemptionTermsType } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercentage } from './utils/formatters';
import { DATA_AS_OF_LABEL } from '../../utils/constants';

interface RedemptionTermsProps {
  redemptionTerms?: RedemptionTermsType;
}

const RedemptionTerms: React.FC<RedemptionTermsProps> = ({ redemptionTerms }) => {
  if (!redemptionTerms) {
    return null;
  }

  // Check if fund is completely locked until maturity
  const isLocked = redemptionTerms.frequency === 'End of Term' && !redemptionTerms.redemptionOpen;

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <ClockAlert className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">Redemption Terms</h2>
          <span className="text-xs text-muted-foreground ml-auto">{DATA_AS_OF_LABEL}</span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Redemption Status</h3>
              {isLocked ? (
                <Badge variant="destructive">Locked Until Maturity</Badge>
              ) : (
                <Badge variant={redemptionTerms.redemptionOpen ? "success" : "destructive"}>
                  {redemptionTerms.redemptionOpen ? "Open for Redemption" : "Closed for Redemption"}
                </Badge>
              )}
            </div>

            <div>
              <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Frequency</h3>
              <p className="text-lg font-bold">{redemptionTerms.frequency}</p>
            </div>

            {redemptionTerms.noticePeriod && redemptionTerms.noticePeriod > 0 && (
              <div>
                <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Notice Period</h3>
                <p className="text-lg font-bold">
                  {redemptionTerms.frequency === 'Daily' && redemptionTerms.noticePeriod <= 5 
                    ? `${redemptionTerms.noticePeriod} business days` 
                    : `${redemptionTerms.noticePeriod} days`
                  }
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {redemptionTerms.earlyRedemptionFee !== undefined && (
              <div className="bg-gradient-to-br from-destructive/5 to-destructive/10 p-5 rounded-xl border border-destructive/20 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-destructive text-sm uppercase tracking-wide mb-2">
                  Early Redemption Fee
                </h3>
                <p className="text-2xl font-bold text-destructive">
                  {formatPercentage(redemptionTerms.earlyRedemptionFee)}
                </p>
              </div>
            )}

            {redemptionTerms.minimumHoldingPeriod !== undefined && (
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-xl border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-primary text-sm uppercase tracking-wide mb-2">
                  Minimum Holding Period
                </h3>
                <p className="text-2xl font-bold text-primary">
                  {redemptionTerms.minimumHoldingPeriod} months
                  {redemptionTerms.minimumHoldingPeriod >= 12 && (
                    <span className="text-sm text-primary/70 ml-1 block mt-1">
                      ({Math.floor(redemptionTerms.minimumHoldingPeriod / 12)} {Math.floor(redemptionTerms.minimumHoldingPeriod / 12) === 1 ? 'year' : 'years'}
                      {redemptionTerms.minimumHoldingPeriod % 12 > 0 ? `, ${redemptionTerms.minimumHoldingPeriod % 12} months` : ''})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default RedemptionTerms;
