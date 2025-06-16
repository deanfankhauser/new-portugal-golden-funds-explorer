
import React, { useEffect } from 'react';
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
        answer: `The minimum investment for ${category} Golden Visa funds is €500,000, as required by Portugal's Golden Visa program. However, some ${category.toLowerCase()} funds may have higher minimum investment thresholds depending on their specific investment strategy and structure.`
      }
    ];
  };

  const faqs = generateCategoryFAQs(categoryName, fundsCount);

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm border mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Frequently Asked Questions about {categoryName} Golden Visa Funds
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq: FAQItem, index: number) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-gray-50 rounded-lg border border-gray-200"
          >
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-100 rounded-t-lg">
              <span className="font-medium text-gray-900">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-700 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default CategoryPageFAQ;
