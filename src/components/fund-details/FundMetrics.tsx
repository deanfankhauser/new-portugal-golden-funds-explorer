
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface FundMetricsProps {
  fund: Fund;
  formatCurrency: (amount: number) => string;
}

const FundMetrics: React.FC<FundMetricsProps> = ({ fund, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-all">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-500 mb-2">Minimum Investment</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(fund.minimumInvestment)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-all">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-500 mb-2">Target Return</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.returnTarget}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-all">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-500 mb-2">Fund Size</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.fundSize} Million EUR</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-all">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-500 mb-2">Term</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.term} years</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-all">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-500 mb-2">Established</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.established}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-all">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-500 mb-2">Regulated By</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.regulatedBy}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-all">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-500 mb-2">Location</h3>
          <p className="text-2xl font-bold text-[#EF4444]">{fund.location}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundMetrics;
