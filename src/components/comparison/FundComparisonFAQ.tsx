import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Fund } from '../../data/types/funds';

interface FAQItem {
  question: string;
  answer: string;
}

interface FundComparisonFAQProps {
  fund1: Fund;
  fund2: Fund;
}

const FundComparisonFAQ: React.FC<FundComparisonFAQProps> = ({ fund1, fund2 }) => {
  // Generate comparison-specific FAQs
  const generateComparisonFAQs = (f1: Fund, f2: Fund): FAQItem[] => {
    const fund1Category = f1.category.toLowerCase();
    const fund2Category = f2.category.toLowerCase();
    const bothSameCategory = f1.category === f2.category;
    
    return [
      {
        question: `What are the key differences between ${f1.name} and ${f2.name}?`,
        answer: `The main differences include investment focus (${f1.category} vs ${f2.category}), minimum investment amounts (€${f1.minimumInvestment.toLocaleString()} vs €${f2.minimumInvestment.toLocaleString()}), management fees (${f1.managementFee}% vs ${f2.managementFee}%), and fund managers (${f1.managerName} vs ${f2.managerName}). Each fund has different risk profiles and return targets suited to different investor preferences.`
      },
      {
        question: `Which fund has lower fees: ${f1.name} or ${f2.name}?`,
        answer: `${f1.managementFee < f2.managementFee ? f1.name : f2.name} has the lower management fee at ${Math.min(f1.managementFee, f2.managementFee)}% compared to ${Math.max(f1.managementFee, f2.managementFee)}%. However, consider the total cost including performance fees: ${f1.name} charges ${f1.performanceFee}% performance fee while ${f2.name} charges ${f2.performanceFee}%. The overall value depends on your investment goals and expected returns.`
      },
      {
        question: `What is the minimum investment required for each fund?`,
        answer: `${f1.name} requires a minimum investment of €${f1.minimumInvestment.toLocaleString()}, while ${f2.name} requires €${f2.minimumInvestment.toLocaleString()}. Both funds meet the Portugal Golden Visa minimum requirement of €500,000. Choose based on your available capital and diversification strategy.`
      },
      {
        question: `Are both funds eligible for Portugal Golden Visa?`,
        answer: `Yes, both ${f1.name} and ${f2.name} are eligible for the Portugal Golden Visa program as they meet the minimum €500,000 investment requirement and are properly regulated investment funds. Investing in either fund can help you qualify for Portuguese residency through the Golden Visa route.`
      },
      {
        question: bothSameCategory 
          ? `Since both funds are in ${f1.category}, how do I choose between them?`
          : `Should I choose a ${fund1Category} fund or a ${fund2Category} fund?`,
        answer: bothSameCategory 
          ? `Both funds focus on ${fund1Category}, so compare their track records, management teams, fee structures, and specific investment strategies. Consider ${f1.name}'s approach managed by ${f1.managerName} versus ${f2.name}'s strategy under ${f2.managerName}. Review their historical performance, redemption terms, and alignment with your investment timeline.`
          : `The choice between ${fund1Category} (${f1.name}) and ${fund2Category} (${f2.name}) depends on your risk tolerance and investment goals. ${fund1Category.charAt(0).toUpperCase() + fund1Category.slice(1)} investments typically offer different risk-return profiles compared to ${fund2Category}. Consider your portfolio diversification needs and long-term investment strategy.`
      },
      {
        question: `How often can I redeem from these funds?`,
        answer: `Redemption terms vary between funds. ${f1.name} offers ${f1.redemptionTerms?.frequency || 'standard'} redemptions, while ${f2.name} provides ${f2.redemptionTerms?.frequency || 'standard'} redemption opportunities. Check the specific notice periods and any redemption fees that may apply. Consider your liquidity needs when choosing between these options.`
      },
      {
        question: `How is the data in this comparison verified?`,
        answer: `All fund data is regularly verified against official sources including fund prospectuses, regulatory filings, and direct communication with fund managers. Data freshness indicators show when each fund's information was last updated. We recommend reviewing the latest fund documents and speaking with the fund managers before making investment decisions.`
      }
    ];
  };

  const faqs = generateComparisonFAQs(fund1, fund2);

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
    const existingFAQSchema = document.querySelector('script[data-schema="comparison-faq"]');
    if (existingFAQSchema) {
      existingFAQSchema.remove();
    }

    // Add new FAQ schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'comparison-faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const schemaScript = document.querySelector('script[data-schema="comparison-faq"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [faqs]);

  return (
    <section className="bg-card rounded-lg p-6 shadow-sm border border-border mt-8" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Frequently Asked Questions: {fund1.name} vs {fund2.name}
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq: FAQItem, index: number) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-muted/50 rounded-lg border border-border"
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

export default FundComparisonFAQ;