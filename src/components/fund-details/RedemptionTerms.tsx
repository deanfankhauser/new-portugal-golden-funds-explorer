
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
      <CardContent className="p-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-8">Redemption Terms</h2>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
              <AlertCircle className="h-[18px] w-[18px] text-muted-foreground" />
              Redemption Status
            </span>
            {isLocked ? (
              <Badge variant="outline" className="text-[13px]">Locked Until Maturity</Badge>
            ) : (
              <Badge variant={redemptionTerms.redemptionOpen ? "default" : "outline"} className="text-[13px]">
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
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
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
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <AlertCircle className="h-[18px] w-[18px] text-muted-foreground" />
                Early Redemption Fee
              </span>
              <span className="text-[15px] font-semibold text-destructive">
                {formatPercentage(redemptionTerms.earlyRedemptionFee)}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground mt-8 pt-8 border-t border-border/60">
          Redemption terms may vary by investor class. Verify details with the fund manager.
        </p>
      </CardContent>
    </Card>
  );
};

export default RedemptionTerms;
