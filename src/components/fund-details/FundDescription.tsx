
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';

interface FundDescriptionProps {
  description: Fund['detailedDescription'];
}

const FundDescription: React.FC<FundDescriptionProps> = ({ description }) => {
  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-accent/10">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">About the Fund</h2>
        </div>
        <div className="prose max-w-none">
          <p className="text-foreground whitespace-pre-line leading-relaxed text-base">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundDescription;
