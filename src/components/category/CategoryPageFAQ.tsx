
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
    // Special handling for Real Estate category (not GV-eligible)
    if (category === 'Real Estate') {
      return [
        {
          question: `What are ${category} investment funds?`,
          answer: `${category} investment funds focus on ${category.toLowerCase()} sectors but are NOT eligible for Portugal's Golden Visa program. Since October 2023, Golden Visa funds cannot have direct or indirect real estate exposure. These funds are available for general investment purposes outside the Golden Visa framework.`
        },
        {
          question: `How many ${category} funds are available?`,
          answer: `Currently, there are ${count} ${category.toLowerCase()} funds available in our directory. Note: These funds are NOT eligible for the Portugal Golden Visa program due to real estate exposure restrictions implemented in October 2023.`
        },
        {
        question: `Why aren't Real Estate funds eligible for Portugal Golden Visa since Oct 2023?`,
        answer: `Since October 2023, Portugal Golden Visa funds cannot have any direct or indirect real estate exposure due to new regulations. Real estate-linked investments no longer qualify for residency purposes. Sources: Nomad Gate Guide & IMI Daily.`
      },
      {
        question: `What should I invest in instead of Real Estate funds for Golden Visa?`,
        answer: `For Portugal Golden Visa eligibility, consider investment funds focused on: debt instruments, equity investments, clean energy projects, private equity, or venture capital. These sectors remain eligible as they don't involve real estate exposure. Minimum €500,000 total investment required.`
        }
      ];
    }

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

    // Remove existing FAQ schema
    const existingFAQSchema = document.querySelector('script[data-schema="faq"]');
    if (existingFAQSchema) {
      existingFAQSchema.remove();
    }

    // Add new FAQ schema with unified data-schema="faq"
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const schemaScript = document.querySelector('script[data-schema="faq"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [faqs]);

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
