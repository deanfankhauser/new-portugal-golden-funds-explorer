import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { FEES_HUB_FAQS } from '@/data/fee-type-content';

export const FeesHubFAQ: React.FC = () => {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">
          Fee FAQs
        </h2>
      </div>
      
      <Accordion type="single" collapsible className="space-y-3">
        {FEES_HUB_FAQS.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-border/60 rounded-lg px-6 bg-card data-[state=open]:bg-muted/20"
          >
            <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FeesHubFAQ;
