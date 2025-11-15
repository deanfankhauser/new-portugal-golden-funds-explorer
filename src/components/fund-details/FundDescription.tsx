
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";


interface FundDescriptionProps {
  description: Fund['detailedDescription'];
}

const FundDescription: React.FC<FundDescriptionProps> = ({ description }) => {
  return (
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-10">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-5">About the Fund</h2>
        <div className="prose max-w-none">
          <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundDescription;
