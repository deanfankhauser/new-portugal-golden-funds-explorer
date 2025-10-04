
import React from 'react';
import { Calendar, Clock, AlertCircle, Lock } from 'lucide-react';
import { RedemptionTerms as RedemptionTermsType } from '../../data/types/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercentage } from './utils/formatters';

interface RedemptionTermsProps {
  redemptionTerms?: RedemptionTermsType;
}

const RedemptionTerms: React.FC<RedemptionTermsProps> = ({ redemptionTerms }) => {
  if (!redemptionTerms) {
    return null;
  }

  const isLocked = redemptionTerms.frequency === 'End of Term' && !redemptionTerms.redemptionOpen;

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Redemption Terms
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main redemption details */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Redemption Status
            </span>
            {isLocked ? (
              <Badge variant="destructive" className="text-xs">Locked Until Maturity</Badge>
            ) : (
              <Badge variant={redemptionTerms.redemptionOpen ? "default" : "destructive"} className="text-xs">
                {redemptionTerms.redemptionOpen ? "Open" : "Closed"}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Frequency
            </span>
            <span className="text-sm font-medium">{redemptionTerms.frequency}</span>
          </div>

          {redemptionTerms.noticePeriod !== undefined && redemptionTerms.noticePeriod > 0 && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Notice Period
              </span>
              <span className="text-sm font-medium">
                {redemptionTerms.frequency === 'Daily' && redemptionTerms.noticePeriod <= 5 
                  ? `${redemptionTerms.noticePeriod} business days` 
                  : `${redemptionTerms.noticePeriod} days`}
              </span>
            </div>
          )}

          {redemptionTerms.minimumHoldingPeriod !== undefined && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Lock-up Period
              </span>
              <span className="text-sm font-medium">
                {redemptionTerms.minimumHoldingPeriod} months
                {redemptionTerms.minimumHoldingPeriod >= 12 && 
                  ` (${Math.floor(redemptionTerms.minimumHoldingPeriod / 12)}y${redemptionTerms.minimumHoldingPeriod % 12 > 0 ? ` ${redemptionTerms.minimumHoldingPeriod % 12}m` : ''})`
                }
              </span>
            </div>
          )}

          {redemptionTerms.earlyRedemptionFee !== undefined && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Early Redemption Fee
              </span>
              <span className="text-sm font-medium text-destructive">
                {formatPercentage(redemptionTerms.earlyRedemptionFee)}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground pt-4 border-t">
          Redemption terms may vary by investor class. Verify details with the fund manager.
        </p>
      </CardContent>
    </Card>
  );
};

export default RedemptionTerms;
