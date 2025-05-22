
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface FundManagerProps {
  managerName: Fund['managerName'];
  managerLogo?: Fund['managerLogo'];
}

const FundManager: React.FC<FundManagerProps> = ({ managerName, managerLogo }) => {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Fund Manager</h2>
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
          {managerLogo && (
            <img 
              src={managerLogo} 
              alt={managerName}
              className="w-16 h-16 object-contain rounded-md"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{managerName}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundManager;
