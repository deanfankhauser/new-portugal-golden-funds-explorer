import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

interface FAQLink {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  bullets?: string[];
  links?: FAQLink[];
}

interface FAQClusterProps {
  id: string;
  title: string;
  faqs: FAQItem[];
}

const FAQCluster: React.FC<FAQClusterProps> = ({ id, title, faqs }) => {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
        {title}
      </h2>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`${id}-${index}`}
            className="bg-card border border-border rounded-lg px-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <AccordionTrigger className="text-left hover:no-underline py-4">
              <h3 className="text-base font-medium text-foreground pr-4" itemProp="name">
                {faq.question}
              </h3>
            </AccordionTrigger>
            <AccordionContent
              className="pb-4"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text" className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
                {faq.bullets && faq.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    {faq.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {faq.links && faq.links.length > 0 && (
                  <div className="pt-2">
                    <span className="text-sm text-muted-foreground">Related: </span>
                    {faq.links.map((link, linkIndex) => (
                      <React.Fragment key={linkIndex}>
                        <Link
                          to={link.href}
                          className="text-sm text-primary hover:underline"
                        >
                          {link.label}
                        </Link>
                        {linkIndex < faq.links!.length - 1 && (
                          <span className="text-muted-foreground">, </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQCluster;
