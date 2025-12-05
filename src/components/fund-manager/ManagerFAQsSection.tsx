import React from 'react';
import FAQSection from '../common/FAQSection';

interface FAQ {
  question: string;
  answer: string;
}

interface ManagerFAQsSectionProps {
  managerName: string;
  faqs: FAQ[];
}

const ManagerFAQsSection: React.FC<ManagerFAQsSectionProps> = ({ 
  managerName, 
  faqs 
}) => {
  return (
    <FAQSection 
      faqs={faqs} 
      title="Frequently Asked Questions"
      schemaId="manager-faq"
      noWrapper={true}
    />
  );
};

export default ManagerFAQsSection;
