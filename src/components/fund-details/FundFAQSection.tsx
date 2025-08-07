
import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FundFAQSectionProps {
  fund: Fund;
}

const FundFAQSection: React.FC<FundFAQSectionProps> = ({ fund }) => {
  // Default FAQs if none provided in fund data
  const defaultFAQs: FAQItem[] = [
    {
      question: `What is the minimum investment for ${fund.name}?`,
      answer: `The minimum investment amount for ${fund.name} varies. Please contact the fund manager for specific details about minimum investment requirements.`
    },
    {
      question: `What are the fees associated with ${fund.name}?`,
      answer: `${fund.name} has management fees and performance fees. Please refer to the fund documentation or contact the manager for detailed fee information.`
    },
    {
      question: `How can I invest in ${fund.name}?`,
      answer: `To invest in ${fund.name}, you can contact the fund manager directly or use our introduction service to get connected with the appropriate representative.`
    }
  ];

  // Use fund-specific FAQs if available, otherwise use default FAQs
  const activeFAQs = (fund as any).faqs && (fund as any).faqs.length > 0 ? (fund as any).faqs : defaultFAQs;

  useEffect(() => {
    // Create FAQ Page schema for SEO
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': activeFAQs.map((faq: FAQItem) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    // Remove existing FAQ schema
    const existingFAQSchema = document.querySelector('script[data-schema="fund-faq"]');
    if (existingFAQSchema) {
      existingFAQSchema.remove();
    }

    // Add new FAQ schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'fund-faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const schemaScript = document.querySelector('script[data-schema="fund-faq"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [activeFAQs]);

  if (activeFAQs.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 rounded-lg p-6" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Frequently Asked Questions about {fund.name}
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {activeFAQs.map((faq: FAQItem, index: number) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-white rounded-lg border border-gray-200"
            itemScope 
            itemType="https://schema.org/Question"
          >
            <AccordionTrigger 
              className="px-6 py-3 text-left hover:no-underline hover:bg-gray-50 rounded-t-lg text-sm"
              itemProp="name"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent 
              className="px-6 pb-4 text-sm text-gray-700 leading-relaxed"
              itemScope 
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">{faq.answer}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FundFAQSection;
