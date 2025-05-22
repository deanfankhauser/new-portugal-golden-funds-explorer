
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';

interface FundDescriptionProps {
  description: Fund['detailedDescription'];
}

const FundDescription: React.FC<FundDescriptionProps> = ({ description }) => {
  return (
    <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <FileText className="w-5 h-5 mr-2 text-[#EF4444]" />
          <h2 className="text-2xl font-bold">About the Fund</h2>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundDescription;
