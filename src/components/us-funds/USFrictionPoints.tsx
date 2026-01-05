import React from 'react';
import { FileText, Clock, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const USFrictionPoints: React.FC = () => {
  const frictionPoints = [
    {
      icon: FileText,
      title: 'Extra Paperwork',
      description: 'US persons typically need to provide W-9 forms, proof of taxpayer status, and enhanced AML/KYC documentation that non-US investors may not require.'
    },
    {
      icon: Building2,
      title: 'Some Managers Are Cautious',
      description: 'Due to regulatory complexity, some fund managers prefer not to accept US investors. However, options exist for those who do accept US persons.'
    },
    {
      icon: Clock,
      title: 'Longer Timelines',
      description: 'Expect longer processing times for subscription and onboarding. Additional compliance checks for US persons can add weeks to the process.'
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Common friction points for US investors
      </h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {frictionPoints.map((point, index) => {
          const Icon = point.icon;
          return (
            <Card key={index} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{point.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default USFrictionPoints;
