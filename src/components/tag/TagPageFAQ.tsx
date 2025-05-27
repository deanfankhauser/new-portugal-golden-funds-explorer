
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

interface TagPageFAQProps {
  tagName: string;
  tagSlug: string;
  fundsCount: number;
}

const TagPageFAQ: React.FC<TagPageFAQProps> = ({ tagName, tagSlug, fundsCount }) => {
  // Generate tag-specific FAQs
  const generateTagFAQs = (tag: string, count: number): FAQItem[] => {
    return [
      {
        question: `What are ${tag} Golden Visa investment funds?`,
        answer: `${tag} Golden Visa investment funds are specialized investment vehicles that focus on ${tag.toLowerCase()} sectors and are eligible for Portugal's Golden Visa program. These funds allow non-EU investors to obtain Portuguese residency by investing €500,000 or more in qualified ${tag.toLowerCase()} investment opportunities.`
      },
      {
        question: `How many ${tag} Golden Visa funds are available?`,
        answer: `Currently, there are ${count} ${tag.toLowerCase()} funds available in our directory that are eligible for the Portugal Golden Visa program. Each fund has been verified to meet the program's requirements and investment criteria.`
      },
      {
        question: `What is the minimum investment for ${tag} Golden Visa funds?`,
        answer: `The minimum investment for ${tag} Golden Visa funds is €500,000, as required by Portugal's Golden Visa program. However, some ${tag.toLowerCase()} funds may have higher minimum investment thresholds depending on their specific investment strategy and structure.`
      },
      {
        question: `Are ${tag} Golden Visa funds safe investments?`,
        answer: `${tag} Golden Visa funds are regulated investment vehicles that must meet strict criteria set by Portuguese authorities. While all investments carry risk, these funds are subject to regulatory oversight and must demonstrate their ability to support Portugal's economic development goals in the ${tag.toLowerCase()} sector.`
      },
      {
        question: `How long do I need to hold my investment in ${tag} Golden Visa funds?`,
        answer: `For Golden Visa eligibility, you must maintain your investment in ${tag} funds for a minimum of 5 years. After this period, you may be eligible for permanent residency or citizenship, depending on other requirements such as language proficiency and time spent in Portugal.`
      },
      {
        question: `Can I include family members in my ${tag} Golden Visa application?`,
        answer: `Yes, when investing in ${tag} Golden Visa funds, you can include your spouse, dependent children under 26, and dependent parents over 65 in your application. This makes the investment particularly attractive for families seeking EU residency.`
      }
    ];
  };

  const faqs = generateTagFAQs(tagName, fundsCount);

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

    // Remove existing FAQ schema for this tag
    const existingFAQSchema = document.querySelector(`script[data-schema="tag-faq-${tagSlug}"]`);
    if (existingFAQSchema) {
      existingFAQSchema.remove();
    }

    // Add new FAQ schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', `tag-faq-${tagSlug}`);
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const schemaScript = document.querySelector(`script[data-schema="tag-faq-${tagSlug}"]`);
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [faqs, tagSlug]);

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm border mt-8" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Frequently Asked Questions about {tagName} Golden Visa Funds
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

export default TagPageFAQ;
