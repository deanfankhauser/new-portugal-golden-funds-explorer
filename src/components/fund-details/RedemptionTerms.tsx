
import React from 'react';
import { ClockAlert } from 'lucide-react';
import { RedemptionTerms } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercentage } from './utils/formatters';

interface RedemptionTermsProps {
  redemptionTerms?: RedemptionTerms;
}

const RedemptionTermsComponent: React.FC<RedemptionTermsProps> = ({ redemptionTerms }) => {
  if (!redemptionTerms) {
    return null;
  }

  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <ClockAlert className="w-5 h-5 mr-2 text-[#EF4444]" />
          <h2 className="text-xl font-bold">Redemption Terms</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Redemption Status</h3>
              <Badge className={redemptionTerms.redemptionOpen ? "bg-green-500" : "bg-red-500"}>
                {redemptionTerms.redemptionOpen ? "Open for Redemption" : "Closed for Redemption"}
              </Badge>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Frequency</h3>
              <p className="text-lg font-bold">{redemptionTerms.frequency}</p>
            </div>

            {redemptionTerms.noticePeriod && (
              <div>
                <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Notice Period</h3>
                <p className="text-lg font-bold">{redemptionTerms.noticePeriod} days</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {redemptionTerms.earlyRedemptionFee !== undefined && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                  Early Redemption Fee
                </h3>
                <p className="text-xl font-bold text-[#EF4444]">
                  {formatPercentage(redemptionTerms.earlyRedemptionFee)}
                </p>
              </div>
            )}

            {redemptionTerms.minimumHoldingPeriod !== undefined && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                  Minimum Holding Period
                </h3>
                <p className="text-xl font-bold">
                  {redemptionTerms.minimumHoldingPeriod} months
                </p>
              </div>
            )}
          </div>

          {redemptionTerms.notes && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <h3 className="font-medium text-blue-700 mb-1">Additional Information</h3>
              <p className="text-sm text-blue-800">{redemptionTerms.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RedemptionTermsComponent;
