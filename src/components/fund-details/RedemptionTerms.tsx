
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
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-5 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-6 md:mb-8">Redemption Terms</h2>
        
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
              <AlertCircle className="h-[18px] w-[18px] text-muted-foreground" />
              Redemption Status
            </span>
            {isLocked ? (
              <Badge variant="outline" className="text-[13px] w-fit">Locked Until Maturity</Badge>
            ) : (
              <Badge variant={redemptionTerms.redemptionOpen ? "default" : "outline"} className="text-[13px] w-fit">
                {redemptionTerms.redemptionOpen ? "Open" : "Closed"}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
              <Calendar className="h-[18px] w-[18px] text-muted-foreground" />
              Frequency
            </span>
            <span className="text-[15px] font-semibold text-foreground">{redemptionTerms.frequency}</span>
          </div>

          {redemptionTerms.noticePeriod !== undefined && redemptionTerms.noticePeriod > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Clock className="h-[18px] w-[18px] text-muted-foreground" />
                Notice Period
              </span>
              <span className="text-[15px] font-semibold text-foreground">
                {redemptionTerms.frequency === 'Daily' && redemptionTerms.noticePeriod <= 5 
                  ? `${redemptionTerms.noticePeriod} business days` 
                  : `${redemptionTerms.noticePeriod} days`}
              </span>
            </div>
          )}

          {redemptionTerms.minimumHoldingPeriod !== undefined && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Lock className="h-[18px] w-[18px] text-muted-foreground" />
                Lock-up Period
              </span>
              <span className="text-[15px] font-semibold text-foreground">
                {redemptionTerms.minimumHoldingPeriod} months
                {redemptionTerms.minimumHoldingPeriod >= 12 && 
                  ` (${Math.floor(redemptionTerms.minimumHoldingPeriod / 12)}y${redemptionTerms.minimumHoldingPeriod % 12 > 0 ? ` ${redemptionTerms.minimumHoldingPeriod % 12}m` : ''})`
                }
              </span>
            </div>
          )}

          {redemptionTerms.earlyRedemptionFee !== undefined && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <AlertCircle className="h-[18px] w-[18px] text-muted-foreground" />
                Early Redemption Fee
              </span>
              <span className="text-[15px] font-semibold text-destructive">
                {formatPercentage(redemptionTerms.earlyRedemptionFee)}
              </span>
            </div>
          )}

          {redemptionTerms.notes && (
            <div className="flex flex-col gap-3 px-4 py-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg">
              <span className="flex items-center gap-2.5 text-sm text-amber-800 dark:text-amber-200 font-medium">
                <AlertCircle className="h-[18px] w-[18px] text-amber-600 dark:text-amber-400 flex-shrink-0" />
                Additional Terms
              </span>
              <p className="text-[15px] font-medium text-amber-900 dark:text-amber-100 leading-relaxed">
                {redemptionTerms.notes}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border/60">
          Redemption terms may vary by investor class. Verify details with the fund manager.
        </p>
      </CardContent>
    </Card>
  );
};

export default RedemptionTerms;
