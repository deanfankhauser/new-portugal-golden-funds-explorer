
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
        answer: `${category} Golden Visa investment funds are specialized investment vehicles that focus on the ${category.toLowerCase()} sector and are eligible for Portugal's Golden Visa program. These funds allow non-EU investors to obtain Portuguese residency by investing €500,000 or more in qualified ${category.toLowerCase()} investment opportunities.`
      },
      {
        question: `How many ${category} Golden Visa funds are available?`,
        answer: `Currently, there are ${count} ${category.toLowerCase()} funds available in our directory that are eligible for the Portugal Golden Visa program. Each fund has been verified to meet the program's requirements and investment criteria.`
      },
      {
        question: `What is the minimum investment for ${category} Golden Visa funds?`,
        answer: `The minimum investment for ${category} Golden Visa funds is €500,000, as required by Portugal's Golden Visa program. However, some ${category.toLowerCase()} funds may have higher minimum investment thresholds depending on their specific investment strategy and structure.`
      },
      {
        question: `Are ${category} Golden Visa funds regulated?`,
        answer: `Yes, ${category} Golden Visa funds are regulated investment vehicles that must meet strict criteria set by Portuguese authorities. These funds are subject to regulatory oversight and must demonstrate their ability to support Portugal's economic development goals in the ${category.toLowerCase()} sector.`
      },
      {
        question: `What are the benefits of investing in ${category} Golden Visa funds?`,
        answer: `Investing in ${category} Golden Visa funds provides multiple benefits: Portuguese residency permit, visa-free travel within the Schengen area, potential for investment returns in the ${category.toLowerCase()} sector, path to permanent residency and citizenship, and the ability to include family members in your application.`
      },
      {
        question: `How do I choose the right ${category} Golden Visa fund?`,
        answer: `When choosing a ${category} Golden Visa fund, consider factors such as the fund's track record, management team experience, investment strategy, fee structure, risk profile, and alignment with your investment goals. It's recommended to consult with financial advisors and review all fund documentation before making a decision.`
      }
    ];
  };

  const faqs = generateCategoryFAQs(categoryName, fundsCount);

  useEffect(() => {
    // Create FAQ Page schema for SEO
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map((faq: FAQItem) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    // Remove existing FAQ schema for this category
    const existingFAQSchema = document.querySelector(`script[data-schema="category-faq-${categorySlug}"]`);
    if (existingFAQSchema) {
      existingFAQSchema.remove();
    }

    // Add new FAQ schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', `category-faq-${categorySlug}`);
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const schemaScript = document.querySelector(`script[data-schema="category-faq-${categorySlug}"]`);
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [faqs, categorySlug]);

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm border mt-8" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Frequently Asked Questions about {categoryName} Golden Visa Funds
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq: FAQItem, index: number) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-gray-50 rounded-lg border border-gray-200"
            itemScope 
            itemType="https://schema.org/Question"
          >
            <AccordionTrigger 
              className="px-6 py-4 text-left hover:no-underline hover:bg-gray-100 rounded-t-lg"
              itemProp="name"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent 
              className="px-6 pb-4 text-gray-700 leading-relaxed"
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
