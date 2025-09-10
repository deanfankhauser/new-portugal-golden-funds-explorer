
import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FundIndexFAQ: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is the Movingto Fund Index?",
      answer: "The Movingto Fund Index is a comprehensive, data-driven ranking system that evaluates Portuguese Golden Visa investment funds based on four key criteria: Performance (40%), Regulatory Quality (25%), Fee Structure (20%), and Investor Protection (15%). It helps investors make informed decisions by providing objective scores for each fund."
    },
    {
      question: "How are the fund scores calculated?",
      answer: "Fund scores are calculated using our proprietary methodology that weighs Performance at 40%, Regulatory Quality at 25%, Fee Structure at 20%, and Investor Protection at 15%. Each criterion has specific metrics and benchmarks that contribute to the overall score out of 100 points."
    },
    {
      question: "How often is the Fund Index updated?",
      answer: "The Fund Index is updated regularly to maintain accuracy and relevance. We continuously monitor fund performance, regulatory changes, fee structures, and other relevant factors to ensure our rankings reflect the most current information available."
    },
    {
      question: "Are all funds in the index eligible for the Portugal Golden Visa?",
      answer: "Yes, all funds listed in our index are eligible for Portugal's Golden Visa program. Each fund has been verified to meet current eligibility criteria including CMVM registration and minimum €500,000 investment requirement. We continuously monitor regulatory compliance to ensure accuracy."
    },
    {
      question: "What does a fund's score mean for investors?",
      answer: "Scores range from 0-100, with 85-100 being Excellent, 70-84 Very Good, 55-69 Good, and below 55 Fair. Higher scores indicate better overall value considering performance potential, regulatory oversight, cost efficiency, and investor protection measures."
    },
    {
      question: "Can I invest directly through this platform?",
      answer: "No, we are an independent research and comparison platform. To invest in any fund, you'll need to contact the fund manager directly or work with a qualified financial professional. We provide detailed contact information for each fund manager."
    },
    {
      question: "How reliable is the data in the Fund Index?",
      answer: "All fund data has been professionally reviewed and verified through official regulatory sources. Our team, including licensed Portuguese lawyer Anna Luisa Lacerda, conducts comprehensive due diligence on all funds to ensure accuracy and regulatory compliance."
    },
    {
      question: "What should I consider beyond the index score?",
      answer: "While our index provides a comprehensive evaluation, you should also consider your personal investment goals, risk tolerance, investment timeline, and tax implications. We recommend consulting with qualified financial and legal professionals before making investment decisions."
    }
  ];

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
    const existingFAQSchema = document.querySelector('script[data-schema="fund-index-faq"]');
    if (existingFAQSchema) {
      existingFAQSchema.remove();
    }

    // Add new FAQ schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'fund-index-faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const schemaScript = document.querySelector('script[data-schema="fund-index-faq"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [faqs]);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50" itemScope itemType="https://schema.org/FAQPage">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
          <div className="bg-accent/20 p-2 rounded-xl">
            <HelpCircle className="h-6 w-6 text-accent" />
          </div>
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq: FAQItem, index: number) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card rounded-lg border border-border shadow-sm"
              itemScope 
              itemType="https://schema.org/Question"
            >
              <AccordionTrigger 
                className="px-6 py-3 text-left hover:no-underline hover:bg-muted rounded-t-lg text-sm font-medium"
                itemProp="name"
              >
                <span className="text-foreground">{faq.question}</span>
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
      </CardContent>
    </Card>
  );
};

export default FundIndexFAQ;
