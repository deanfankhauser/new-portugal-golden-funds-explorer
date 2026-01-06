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
    question: "What's the minimum for the fund route?",
    answer: "€500,000 total investment for the Golden Visa fund route. Real estate paths were removed in October 2023. A fund's subscription minimum can be lower, but you still need €500,000 across qualifying funds."
  },
  {
    question: "Are these funds regulated?",
    answer: "We list funds from CMVM-regulated managers where disclosed. Always verify each fund's registration and Golden Visa eligibility with your legal counsel before investing."
  },
  {
    question: "How does Movingto Funds help?",
    answer: "We aggregate fund disclosures, fee structures, and liquidity terms in one place. You can filter, compare, and shortlist funds—then request an introduction to the manager directly."
  },
  {
    question: "Is this investment advice?",
    answer: "No. Movingto Funds provides disclosure-led fund profiles for research purposes. We don't provide financial, legal, or tax advice. Consult a regulated adviser before investing."
  },
  {
    question: "How do I request a fund introduction?",
    answer: "Shortlist funds you're interested in, then use the 'Request Intro' button on each fund's profile. We'll facilitate an introduction to the fund manager."
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

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {HOMEPAGE_FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA to full FAQ page */}
          <div className="text-center mt-8">
            <Button asChild variant="outline">
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
