import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FAQLink {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  bullets?: string[];
  links?: FAQLink[];
}

export interface UniversalFAQProps {
  faqs: FAQItem[];
  systemFaqs?: FAQItem[];
  title?: string;
  subtitle?: string;
  schemaId?: string;
  skipStructuredData?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'compact' | 'card-wrapped';
  showViewAllLink?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  /** @deprecated Use variant="compact" with no title instead */
  noWrapper?: boolean;
}

const UniversalFAQ: React.FC<UniversalFAQProps> = ({
  faqs,
  systemFaqs,
  title,
  subtitle,
  schemaId = 'faq',
  skipStructuredData = true,
  showIcon = false,
  icon,
  variant = 'default',
  showViewAllLink = false,
  viewAllHref = '/faqs',
  viewAllLabel = 'View All FAQs',
  className = '',
  noWrapper = false,
}) => {
  // Client-side schema injection (only if SSG doesn't handle it)
  useEffect(() => {
    const allFaqs = [...faqs, ...(systemFaqs || [])];
    
    if (!allFaqs || allFaqs.length === 0 || skipStructuredData) return;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': allFaqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
    
    const existingFAQSchema = document.querySelector(`script[data-schema="${schemaId}"]`);
    if (existingFAQSchema) existingFAQSchema.remove();
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', schemaId);
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    
    return () => {
      const schemaScript = document.querySelector(`script[data-schema="${schemaId}"]`);
      if (schemaScript) schemaScript.remove();
    };
  }, [faqs, systemFaqs, schemaId, skipStructuredData]);

  if (!faqs || faqs.length === 0) return null;

  const renderFAQItem = (faq: FAQItem, index: number, prefix: string = 'faq') => (
    <AccordionItem
      key={`${prefix}-${index}`}
      value={`${prefix}-${index}`}
      className="border border-border/60 rounded-lg px-6 bg-card data-[state=open]:bg-muted/20"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-4">
        <span itemProp="name">{faq.question}</span>
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
  );

  const accordionContent = (
    <>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, index) => renderFAQItem(faq, index, 'faq'))}
      </Accordion>

      {/* System FAQs Section with Visual Divider */}
      {systemFaqs && systemFaqs.length > 0 && (
        <>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Compliance & Structural Details
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {systemFaqs.map((faq, index) => renderFAQItem(faq, index, 'system-faq'))}
          </Accordion>
        </>
      )}
    </>
  );

  // Compact variant (no outer wrapper)
  if (variant === 'compact' || noWrapper) {
    return (
      <div 
        className={className}
        itemScope 
        itemType="https://schema.org/FAQPage"
      >
        {title && (
          <div className="flex items-center gap-2 mb-6">
            {showIcon && icon}
            <h2 className="text-2xl font-semibold text-foreground">
              {title}
            </h2>
          </div>
        )}
        {subtitle && (
          <p className="text-muted-foreground mb-6">{subtitle}</p>
        )}
        {accordionContent}
        {showViewAllLink && (
          <div className="text-center mt-6">
            <Link 
              to={viewAllHref} 
              className="text-sm text-primary hover:underline"
            >
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Card-wrapped variant
  if (variant === 'card-wrapped') {
    return (
      <section 
        className={`py-12 sm:py-16 ${className}`}
        itemScope 
        itemType="https://schema.org/FAQPage"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {(title || subtitle) && (
              <div className="text-center mb-8">
                {title && (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {showIcon && icon}
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {title}
                    </h2>
                  </div>
                )}
                {subtitle && (
                  <p className="text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
            
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-border"
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:text-primary text-base font-medium py-4">
                      <span itemProp="name">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent 
                      className="text-muted-foreground leading-relaxed pb-4"
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <span itemProp="text">{faq.answer}</span>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            {showViewAllLink && (
              <div className="text-center mt-8">
                <Link 
                  to={viewAllHref}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md shadow-sm hover:bg-muted transition-colors"
                >
                  {viewAllLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default variant (section with background)
  return (
    <section 
      className={`py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 ${className}`}
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="flex items-center gap-2 mb-12">
            {showIcon && icon}
            <h2 className="text-3xl font-semibold text-foreground">
              {title}
            </h2>
          </div>
        )}
        {subtitle && (
          <p className="text-muted-foreground mb-8 -mt-8">{subtitle}</p>
        )}
        {accordionContent}
        {showViewAllLink && (
          <div className="text-center mt-8">
            <Link 
              to={viewAllHref} 
              className="text-primary hover:underline"
            >
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default UniversalFAQ;
