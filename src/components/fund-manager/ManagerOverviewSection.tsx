import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Profile } from '@/types/profile';

interface ManagerOverviewSectionProps {
  managerName: string;
  managerProfile?: Profile | null;
}

const ManagerOverviewSection: React.FC<ManagerOverviewSectionProps> = ({ 
  managerName, 
  managerProfile 
}) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              About {managerName}
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground/80 leading-relaxed">
                {managerProfile?.manager_about || managerProfile?.description || 
                  `${managerName} is a CMVM-regulated Portugal Golden Visa fund manager specializing in qualified investment funds for international investors seeking Portuguese residency through capital transfer.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ManagerOverviewSection;
