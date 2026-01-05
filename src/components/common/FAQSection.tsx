import React, { useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  systemFaqs?: FAQ[];
  title?: string;
  schemaId?: string;
  noWrapper?: boolean;
  skipStructuredData?: boolean; // Skip client-side schema injection when SSG handles it
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  faqs, 
  systemFaqs,
  title = "Frequently Asked Questions",
  schemaId = "faq",
  noWrapper = false,
  skipStructuredData = false
}) => {
  useEffect(() => {
    // Merge manual and system FAQs for structured data
    const allFaqs = [...faqs, ...(systemFaqs || [])];
    
    // Skip structured data injection if SSG already handled it
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

  const content = (
    <>
      <h2 className="text-3xl font-semibold text-foreground mb-12">
        {title}
      </h2>
      
      {/* Manual FAQs */}
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-card rounded-xl border border-border/40 p-8 shadow-sm hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            itemScope 
            itemType="https://schema.org/Question"
          >
            <h3 
              className="text-xl font-semibold text-foreground leading-relaxed mb-3"
              itemProp="name"
            >
              {faq.question}
            </h3>
            <div 
              itemScope 
              itemType="https://schema.org/Answer"
            >
              <p 
                className="text-base text-muted-foreground leading-relaxed"
                itemProp="text"
              >
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* System FAQs Section with Visual Divider */}
      {systemFaqs && systemFaqs.length > 0 && (
        <>
          {/* Visual Divider */}
          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Compliance & Structural Details
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          
          {/* System FAQs */}
          <div className="space-y-8">
            {systemFaqs.map((faq, index) => (
              <div 
                key={`system-faq-${index}`}
                className="bg-card rounded-xl border border-border/40 p-8 shadow-sm hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                itemScope 
                itemType="https://schema.org/Question"
              >
                <h3 
                  className="text-xl font-semibold text-foreground leading-relaxed mb-3"
                  itemProp="name"
                >
                  {faq.question}
                </h3>
                <div 
                  itemScope 
                  itemType="https://schema.org/Answer"
                >
                  <p 
                    className="text-base text-muted-foreground leading-relaxed"
                    itemProp="text"
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );

  if (noWrapper) {
    return (
      <div 
        itemScope 
        itemType="https://schema.org/FAQPage"
      >
        {content}
      </div>
    );
  }

  return (
    <section 
      className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-7xl mx-auto">
        {content}
      </div>
    </section>
  );
};

export default FAQSection;