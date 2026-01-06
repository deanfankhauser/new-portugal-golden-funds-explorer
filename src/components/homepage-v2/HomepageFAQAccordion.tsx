import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

interface FAQItem {
  question: string;
  answer: string;
}

const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "What's the minimum investment for the fund route?",
    answer: "The fund route typically starts at €500,000 (plus government/legal costs). Specific fund minimums can differ—check each fund's \"Minimum\" field."
  },
  {
    question: "Are these funds regulated?",
    answer: "Eligible funds are typically Portuguese regulated funds with oversight. Regulation doesn't remove risk—always verify the fund's official documents and registration details."
  },
  {
    question: "Is this investment advice?",
    answer: "No. Movingto Funds is a directory and comparison platform. We help you shortlist and understand terms—your final decision should be made with licensed professionals."
  },
  {
    question: "What does \"Verified\" mean on Movingto Funds?",
    answer: "\"Verified\" means we've checked certain claims against available sources (and show what we checked). It's not an endorsement—use it as a due-diligence shortcut."
  },
  {
    question: "What fees should I pay attention to?",
    answer: "Focus on ongoing fees (management/admin) and performance fees, plus any subscription/redemption costs. Fees vary widely and can materially change outcomes."
  },
  {
    question: "What are typical lock-up and redemption terms?",
    answer: "Many GV funds have multi-year terms and limited redemption windows. Liquidity varies by fund—compare lock-up, redemption frequency, and maturity before shortlisting."
  },
  {
    question: "How long does the Golden Visa process take with funds?",
    answer: "Timelines vary by applicant and administration, but most people should expect a multi-month process with several steps. We can outline the steps and connect you to the right operators."
  },
  {
    question: "How do I request a fund introduction?",
    answer: "Shortlist 1–3 funds, click Request intro, and share your basics (nationality, timeline, budget). We'll coordinate the intro and next steps."
  }
];

const HomepageFAQAccordion: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers about the Portugal Golden Visa fund route
            </p>
          </div>

          {/* FAQ Accordion in Card */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {HOMEPAGE_FAQS.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-border"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary text-base font-medium py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA to full FAQ page */}
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="shadow-sm">
              <Link to="/faqs">
                View All FAQs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: HOMEPAGE_FAQS.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        })}
      </script>
    </section>
  );
};

export default HomepageFAQAccordion;
