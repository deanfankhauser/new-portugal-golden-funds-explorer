
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';

interface FundManagerData {
  name: string;
  logo?: string;
  fundsCount: number;
  totalFundSize: number;
  funds: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    minimumInvestment: number;
    fundSize: number;
    returnTarget: string;
  }>;
}

interface FundManagerHeaderProps {
  managerData: FundManagerData;
}

const FundManagerHeader: React.FC<FundManagerHeaderProps> = ({ managerData }) => {
  return (
    <Card className="border border-gray-100 shadow-md mb-10">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <User className="w-6 h-6 mr-2 text-[#EF4444]" />
          <h1 className="text-3xl font-bold">{managerData.name} | Portugal Golden Visa Fund Manager</h1>
        </div>
        
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
          {managerData.logo && (
            <img 
              src={managerData.logo} 
              alt={managerData.name}
              className="w-20 h-20 object-contain rounded-md shadow-sm border border-slate-100 bg-white p-2 mb-4"
            />
          )}
          <p className="text-lg text-gray-600">
            {managerData.name} manages {managerData.fundsCount} fund{managerData.fundsCount > 1 ? 's' : ''} with a combined 
            size of {managerData.totalFundSize} million EUR.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundManagerHeader;
