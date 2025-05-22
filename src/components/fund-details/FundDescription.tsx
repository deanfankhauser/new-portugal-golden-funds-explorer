
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface FundDescriptionProps {
  description: Fund['detailedDescription'];
}

const FundDescription: React.FC<FundDescriptionProps> = ({ description }) => {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">About the Fund</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundDescription;
