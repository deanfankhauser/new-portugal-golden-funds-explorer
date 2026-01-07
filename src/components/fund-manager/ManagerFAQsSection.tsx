import React from 'react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';

interface ManagerFAQsSectionProps {
  managerName: string;
  faqs: FAQItem[];
}

const ManagerFAQsSection: React.FC<ManagerFAQsSectionProps> = ({ 
  managerName, 
  faqs 
}) => {
  return (
    <UniversalFAQ 
      faqs={faqs} 
      title="Frequently Asked Questions"
      schemaId="manager-faq"
      variant="compact"
      skipStructuredData={true}
    />
  );
};

export default ManagerFAQsSection;
