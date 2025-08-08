
import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FundManagerFAQsProps {
  fund: Fund;
}

const FundManagerFAQs: React.FC<FundManagerFAQsProps> = ({ fund }) => {
  const generateFAQs = (fund: Fund): FAQItem[] => {
    return [
      {
        question: `What is the minimum investment amount for ${fund.name}?`,
        answer: `The minimum investment for ${fund.name} is €${fund.minimumInvestment.toLocaleString()}. This amount qualifies for Portugal's Golden Visa program when investing in eligible funds.`
      },
      {
        question: `How does ${fund.name} qualify for the Golden Visa program?`,
        answer: `${fund.name} is structured to meet Portugal's Golden Visa requirements for investment funds. By investing the minimum required amount, investors can qualify for Portuguese residency and eventually citizenship.`
      },
      {
        question: `What are the fees associated with ${fund.name}?`,
        answer: `${fund.name} charges a ${fund.managementFee}% annual management fee${fund.performanceFee ? ` and a ${fund.performanceFee}% performance fee` : ''}. ${fund.subscriptionFee ? `There is also a ${fund.subscriptionFee}% subscription fee` : 'There are no subscription fees'}.`
      },
      {
        question: `What is the expected return for ${fund.name}?`,
        answer: `${fund.name} targets ${fund.returnTarget}. However, past performance does not guarantee future results, and all investments carry risk. We recommend consulting with our advisors to understand the risk profile.`
      },
      {
        question: `How long is the investment term for ${fund.name}?`,
        answer: `${fund.name} has a ${fund.term}-year investment term. ${fund.redemptionTerms?.frequency ? `Redemptions are available ${fund.redemptionTerms.frequency.toLowerCase()}` : 'Please refer to the fund documentation for specific redemption terms'}.`
      },
      {
        question: `Who regulates ${fund.name} and where is it located?`,
        answer: `${fund.name} is regulated by ${fund.regulatedBy} and is located in ${fund.location}. This ensures compliance with Portuguese and European investment regulations.`
      },
      {
        question: `How can MovingTo help me invest in ${fund.name}?`,
        answer: `MovingTo's fund advisory team can provide personalized guidance on ${fund.name}, help you understand if it fits your Golden Visa strategy, assist with the application process, and provide ongoing support throughout your investment journey.`
      }
    ];
  };

  const faqs = generateFAQs(fund);

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
    const existingFAQSchema = document.querySelector('script[data-schema="fund-manager-faq"]');
    if (existingFAQSchema) {
      existingFAQSchema.remove();
    }

    // Add new FAQ schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'fund-manager-faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const schemaScript = document.querySelector('script[data-schema="fund-manager-faq"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [faqs]);

  return (
    <Card className="border border-gray-100 shadow-sm" itemScope itemType="https://schema.org/FAQPage">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            FAQs about {fund.name}
          </h3>
          <Link 
            to={`/funds/${fund.id}`}
            className="text-[#EF4444] hover:text-[#EF4444]/80 transition-colors flex items-center gap-1 text-sm"
          >
            View full details
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              itemScope 
              itemType="https://schema.org/Question"
            >
              <AccordionTrigger 
                className="text-left hover:no-underline py-3 text-sm"
                itemProp="name"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent 
                className="text-sm text-gray-700 leading-relaxed"
                itemScope 
                itemType="https://schema.org/Answer"
              >
                <div itemProp="text">{faq.answer}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Need personalized advice?</strong> Our fund advisory team can help you determine if {fund.name} is right for your Golden Visa investment strategy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundManagerFAQs;
