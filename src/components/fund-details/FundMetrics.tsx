
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface FundMetricsProps {
  fund: Fund;
  formatCurrency: (amount: number) => string;
  formatFundSize?: () => React.ReactNode;
}

const FundMetrics: React.FC<FundMetricsProps> = ({ fund, formatCurrency, formatFundSize }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wide">Minimum Investment</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(fund.minimumInvestment)}</p>
          {fund.id === '3cc-golden-income' && (
            <p className="text-sm text-gray-600 mt-1">Class A (€300,000 for Class D)</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wide">Target Return</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.returnTarget}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wide">Fund Size</h3>
          <p className="text-2xl font-bold text-[#EF4444]">
            {formatFundSize ? formatFundSize() : `${fund.fundSize} Million EUR`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wide">Term</h3>
          <p className="text-2xl font-bold text-[#EF4444]">
            {fund.term === 0 ? "Perpetual (open-ended)" : `${fund.term} years`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wide">Established</h3>
          <p className="text-2xl font-bold text-[#EF4444]">
            {fund.id === '3cc-golden-income' ? 'April 2025' : fund.established}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wide">Regulated By</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.regulatedBy}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wide">Location</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.location}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundMetrics;
