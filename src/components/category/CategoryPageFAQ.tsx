
import React, { useEffect } from 'react';
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

interface CategoryPageFAQProps {
  categoryName: string;
  categorySlug: string;
  fundsCount: number;
}

const CategoryPageFAQ: React.FC<CategoryPageFAQProps> = ({ categoryName, categorySlug, fundsCount }) => {
  // Generate category-specific FAQs
  const generateCategoryFAQs = (category: string, count: number): FAQItem[] => {
    // All categories are now Golden Visa eligible

    // Default FAQs for GV-eligible categories
    return [
      {
        question: `What are ${category} Golden Visa investment funds?`,
        answer: `${category} Golden Visa investment funds are specialized investment vehicles that focus on ${category.toLowerCase()} sectors and are eligible for Portugal's Golden Visa program. These funds allow non-EU investors to obtain Portuguese residency by investing €500,000 or more in qualified ${category.toLowerCase()} investment opportunities.`
      },
      {
        question: `How many ${category} Golden Visa funds are available?`,
        answer: `Currently, there are ${count} ${category.toLowerCase()} funds available in our directory that are eligible for the Portugal Golden Visa program. Each fund has been verified to meet the program's requirements and investment criteria.`
      },
      {
        question: `What is the minimum investment for ${category} Golden Visa funds?`,
        answer: `The minimum investment for Golden Visa fund route is €500,000 total (post-October 2023 regulatory changes), regardless of category. Individual ${category.toLowerCase()} fund subscription minimums may vary, but total qualifying investment across one or more funds must reach €500,000. No real estate exposure permitted. Sources: Nomad Gate Guide & IMI Daily.`
      }
    ];
  };

  const faqs = generateCategoryFAQs(categoryName, fundsCount);

  useEffect(() => {
    // Register FAQs with unified schema service
    const cleanup = FAQSchemaService.registerFAQs({
      schemaId: `category-faq-${categorySlug}`,
      faqs: faqs,
      pageContext: `${categoryName} Portugal Golden Visa Funds`
    });

    return cleanup;
  }, [faqs, categorySlug, categoryName]);

  return (
    <section className="bg-card rounded-lg p-6 shadow-sm border mt-8" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Frequently Asked Questions about {categoryName} Portugal Golden Visa Investment Funds
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq: FAQItem, index: number) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-muted rounded-lg border border-border"
            itemScope 
            itemType="https://schema.org/Question"
          >
            <AccordionTrigger 
              className="px-6 py-3 text-left hover:no-underline hover:bg-muted/50 rounded-t-lg text-sm"
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

export default CategoryPageFAQ;
