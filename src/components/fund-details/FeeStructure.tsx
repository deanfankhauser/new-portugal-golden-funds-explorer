
import React from 'react';
import { FileText } from 'lucide-react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface FeeStructureProps {
  fund: Fund;
  formatPercentage: (value: number) => string;
}

const FeeStructure: React.FC<FeeStructureProps> = ({ fund, formatPercentage }) => {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <FileText className="w-5 h-5 mr-2 text-[#EF4444]" />
          <h2 className="text-xl font-bold">Fee Structure</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Management Fee</h3>
            <p className="text-2xl font-bold text-[#EF4444] mt-1">{formatPercentage(fund.managementFee)}</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Performance Fee</h3>
            <p className="text-2xl font-bold text-[#EF4444] mt-1">{formatPercentage(fund.performanceFee)}</p>
          </div>
          
          {fund.subscriptionFee !== undefined && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Subscription Fee</h3>
              <p className="text-2xl font-bold text-[#EF4444] mt-1">{formatPercentage(fund.subscriptionFee)}</p>
            </div>
          )}
          
          {fund.redemptionFee !== undefined && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Redemption Fee</h3>
              <p className="text-2xl font-bold text-[#EF4444] mt-1">{formatPercentage(fund.redemptionFee)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeStructure;
