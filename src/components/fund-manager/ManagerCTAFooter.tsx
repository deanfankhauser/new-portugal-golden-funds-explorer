import React from 'react';
import { Button } from '@/components/ui/button';

interface ManagerCTAFooterProps {
  managerName: string;
}

const ManagerCTAFooter: React.FC<ManagerCTAFooterProps> = ({ managerName }) => {
  const scrollToForm = () => {
    const formElement = document.getElementById('manager-enquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Invest with {managerName}?
        </h2>
        <p className="text-lg opacity-90 mb-8">
          Schedule a consultation with a MovingTo advisor to explore fund options
        </p>
        <Button 
          onClick={scrollToForm}
          size="lg"
          variant="secondary"
          className="px-10 py-6 text-lg font-semibold hover:scale-105 transition-transform"
        >
          Schedule Free Consultation
        </Button>
      </div>
    </section>
  );
};

export default ManagerCTAFooter;
