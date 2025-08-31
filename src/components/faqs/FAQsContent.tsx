
import React from 'react';
import { Link } from 'react-router-dom';
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

const FAQsContent = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is a Golden Visa investment fund?",
      answer: "A Golden Visa investment fund is a regulated investment vehicle that allows foreign investors to obtain Portuguese residency by making a qualifying investment. For Portugal's Golden Visa program, eligible funds must focus on private equity/venture capital with €500,000 minimum investment and cannot be linked to real estate (rule changed October 2023). Sources: Nomad Gate Guide & IMI Daily change documentation."
    },
    {
      question: "What are the minimum investment amounts?",
      answer: "Portugal Golden Visa fund route requires €500,000 total investment (post-October 2023 changes), with no real estate exposure permitted. Individual fund subscription minimums may be lower, but total qualifying investment must reach €500,000. Sources: Nomad Gate analysis and IMI Daily regulatory updates."
    },
    {
      question: "How long does the Golden Visa process take?",
      answer: "The processing time varies by country and fund. Typically, it takes 3-12 months from application submission to approval. This includes due diligence, document verification, and government processing. Some countries offer expedited processing for additional fees."
    },
    {
      question: "What are the tax implications of Golden Visa investments?",
      answer: "Tax implications depend on your country of residence, the fund's jurisdiction, and the type of investment. Generally, you may be subject to capital gains tax, income tax on distributions, and potentially wealth taxes. We recommend consulting with a tax advisor familiar with international tax law."
    },
    {
      question: "Can family members be included in the Golden Visa application?",
      answer: "Most Golden Visa programs allow inclusion of family members, typically including spouse, dependent children, and sometimes parents or grandparents. Each family member may require additional investment or fees. Check specific program requirements for eligibility criteria."
    },
    {
      question: "What are the ongoing obligations after obtaining a Golden Visa?",
      answer: "Ongoing obligations typically include maintaining the investment for a minimum period (usually 5 years), meeting minimum residency requirements, and complying with tax obligations. Some programs require periodic renewals and proof of continued investment."
    },
    {
      question: "How do I compare different Golden Visa funds?",
      answer: "When comparing funds, consider factors such as minimum investment amount, expected returns, risk level, management fees, fund track record, liquidity terms, and the specific Golden Visa program requirements. Our comparison tools help you evaluate these factors side by side."
    },
    {
      question: "What happens if I want to exit my investment early?",
      answer: "Early exit terms vary by fund. Some funds offer liquidity windows at specific intervals, while others may have lock-up periods. Early withdrawal may result in penalties or reduced returns. Review the fund's redemption terms carefully before investing."
    }
  ];

  return (
    <div className="bg-card p-8 rounded-lg shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-foreground">
          Portugal Golden Visa Investment Funds - Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions about Portugal Golden Visa investment funds, eligibility requirements, and the application process.
          Browse our comprehensive <Link to="/index" className="text-primary hover:underline">Portugal Golden Visa Investment Fund Index</Link> for detailed fund rankings and comparisons.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">
          Portugal Golden Visa Investment Fund Questions and Answers
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border border-border rounded-lg"
          >
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50 rounded-t-lg">
              <span className="font-semibold text-foreground">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQsContent;
