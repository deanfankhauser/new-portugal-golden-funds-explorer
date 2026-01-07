import React from 'react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  systemFaqs?: FAQ[];
  title?: string;
  schemaId?: string;
  noWrapper?: boolean;
  skipStructuredData?: boolean;
}

/**
 * @deprecated Use UniversalFAQ directly instead
 * This is a thin wrapper for backward compatibility
 */
const FAQSection: React.FC<FAQSectionProps> = ({ 
  faqs, 
  systemFaqs,
  title = "Frequently Asked Questions",
  schemaId = "faq",
  noWrapper = false,
  skipStructuredData = true
}) => {
  return (
    <UniversalFAQ
      faqs={faqs as FAQItem[]}
      systemFaqs={systemFaqs as FAQItem[]}
      title={title}
      schemaId={schemaId}
      variant={noWrapper ? 'compact' : 'default'}
      skipStructuredData={skipStructuredData}
    />
  );
};

export default FAQSection;