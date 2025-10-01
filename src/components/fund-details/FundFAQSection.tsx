
import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { FAQSchemaService } from '../../services/faqSchemaService';
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
    // Register FAQs with unified schema service
    const cleanup = FAQSchemaService.registerFAQs({
      schemaId: `fund-faq-${fund.id}`,
      faqs: activeFAQs,
      pageContext: `${fund.name} Portugal Golden Visa Fund`
    });

    return cleanup;
  }, [activeFAQs, fund.id, fund.name]);

  if (activeFAQs.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted rounded-lg p-6" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Frequently Asked Questions about {fund.name}
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {activeFAQs.map((faq: FAQItem, index: number) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-card rounded-lg border border-border"
            itemScope 
            itemType="https://schema.org/Question"
          >
            <AccordionTrigger 
              className="px-6 py-3 text-left hover:no-underline hover:bg-muted rounded-t-lg text-sm"
              itemProp="name"
            >
              <span className="font-medium text-foreground">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent 
              className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed"
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
