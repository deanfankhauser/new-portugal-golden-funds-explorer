import React, { useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface ManagerFAQsSectionProps {
  managerName: string;
  faqs: FAQ[];
}

const ManagerFAQsSection: React.FC<ManagerFAQsSectionProps> = ({ 
  managerName, 
  faqs 
}) => {
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
    
    const existingFAQSchema = document.querySelector('script[data-schema="manager-faq"]');
    if (existingFAQSchema) existingFAQSchema.remove();
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'manager-faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    
    return () => {
      const schemaScript = document.querySelector('script[data-schema="manager-faq"]');
      if (schemaScript) schemaScript.remove();
    };
  }, [faqs]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl border border-border/40 p-8 shadow-sm hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0 mt-1">
                  <HelpCircle className="h-3.5 w-3.5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground leading-relaxed">
                  {faq.question}
                </h3>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed pl-9">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManagerFAQsSection;
