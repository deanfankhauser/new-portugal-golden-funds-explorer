import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';

interface ManagerOverviewSectionProps {
  managerName: string;
  managerProfile?: Profile | null;
}

const ManagerOverviewSection: React.FC<ManagerOverviewSectionProps> = ({ 
  managerName, 
  managerProfile 
}) => {
  const scrollToForm = () => {
    const formElement = document.getElementById('manager-enquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* About Section */}
          <div className="space-y-6">
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

          {/* Contact Sidebar */}
          <div>
            <Card className="bg-muted/50 border-border/40 shadow-sm sticky top-24">
              <CardContent className="p-8">
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  Contact Regulated Advisor
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Speak with a MovingTo advisor about {managerName}'s funds. Our team can help you understand which fund aligns with your goals.
                </p>
                <Button 
                  onClick={scrollToForm}
                  className="w-full"
                  size="lg"
                >
                  Request Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagerOverviewSection;
