import React from 'react';
import { HelpCircle } from 'lucide-react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';
import { FEES_HUB_FAQS } from '@/data/fee-type-content';

export const FeesHubFAQ: React.FC = () => {
  const faqs: FAQItem[] = FEES_HUB_FAQS.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <section className="mt-12">
      <UniversalFAQ 
        faqs={faqs}
        title="Fee FAQs"
        showIcon={true}
        icon={<HelpCircle className="h-5 w-5 text-primary" />}
        schemaId="fees-hub-faq"
        variant="compact"
        skipStructuredData={true}
      />
    </section>
  );
};

export default FeesHubFAQ;
