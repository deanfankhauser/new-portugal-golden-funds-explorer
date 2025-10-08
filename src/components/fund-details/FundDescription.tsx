
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
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-accent/10 shrink-0">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground pt-1">About the Fund</h2>
        </div>
        <div className="prose max-w-none ml-[44px]">
          <p className="text-foreground whitespace-pre-line leading-relaxed text-base">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundDescription;
