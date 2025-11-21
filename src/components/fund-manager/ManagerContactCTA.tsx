import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import StandardCard from '../common/StandardCard';

interface ManagerContactCTAProps {
  managerName: string;
}

const scrollToContactForm = () => {
  const element = document.getElementById('contact-form');
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Focus first input after scroll
    setTimeout(() => {
      const firstInput = element.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 500);
  }
};

export const ManagerContactCTA: React.FC<ManagerContactCTAProps> = ({ managerName }) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-y border-border">
      <div className="max-w-4xl mx-auto">
        <StandardCard padding="lg" className="text-center border-2 border-primary/20">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Interested in {managerName}'s Funds?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Get personalized guidance on investment strategies, fund options, and Golden Visa eligibility. Our team responds within 24-48 hours.
              </p>
            </div>

            <Button
              onClick={scrollToContactForm}
              size="lg"
              className="mt-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:translate-y-[-2px] font-semibold px-8 py-6 text-lg h-14"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Get in Touch
            </Button>

            <p className="text-sm text-muted-foreground">
              No commitment required • Free consultation • Secure & confidential
            </p>
          </div>
        </StandardCard>
      </div>
    </section>
  );
};
