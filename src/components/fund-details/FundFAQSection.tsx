import React, { useEffect, useRef } from 'react';
import { Fund } from '../../data/funds';
interface FAQItem {
  question: string;
  answer: string;
}

interface FundFAQSectionProps {
  fund: Fund;
}

const FundFAQSection: React.FC<FundFAQSectionProps> = ({ fund }) => {
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Default FAQs if none provided in fund data
  const defaultFAQs: FAQItem[] = [
    {
      question: `What makes ${fund.name} unique?`,
      answer: `${fund.name} offers a distinctive investment approach with carefully selected strategies designed to achieve optimal returns while managing risk. The fund combines experienced management with rigorous investment processes to deliver value to investors.`
    },
    {
      question: `How is risk managed?`,
      answer: `${fund.name} employs a multi-layered risk management approach designed to protect capital while pursuing growth opportunities. This includes asset diversification, rigorous selection processes, regular portfolio rebalancing, and professional oversight by experienced managers with proven track records.`
    },
    {
      question: `What are the investment requirements?`,
      answer: `The minimum investment for ${fund.name} is ${fund.minimumInvestment ? `€${fund.minimumInvestment.toLocaleString()}` : 'available upon request'}. The fund features ${fund.redemptionTerms?.frequency || 'periodic'} redemptions with ${fund.redemptionTerms?.minimumHoldingPeriod ? `a ${fund.redemptionTerms.minimumHoldingPeriod}-month` : 'a'} lock-up period. ${fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod} days notice` : 'Advance notice'} is required for redemptions.`
    },
    {
      question: fund.tags?.includes('Golden Visa Eligible') 
        ? `How does the Golden Visa qualification work?`
        : `What are the regulatory requirements?`,
      answer: fund.tags?.includes('Golden Visa Eligible')
        ? `${fund.name} is approved by Portuguese authorities as a Golden Visa qualifying investment. By investing the minimum amount, you become eligible to apply for Portuguese residency through the Golden Visa program. The fund maintains full compliance with CMVM regulations${fund.cmvmId ? ` and is registered under CMVM #${fund.cmvmId}` : ''}. Our team works closely with investors to ensure all documentation meets Golden Visa requirements.`
        : `${fund.name} operates under strict regulatory oversight${fund.regulatedBy ? ` by ${fund.regulatedBy}` : ''}${fund.cmvmId ? ` and is registered with CMVM #${fund.cmvmId}` : ''}. The fund maintains full compliance with all applicable securities regulations and reporting requirements.`
    },
    {
      question: `What are the expected returns?`,
      answer: `${fund.name} ${fund.returnTarget ? `targets ${fund.returnTarget}` : 'aims to deliver competitive returns'}${fund.historicalPerformance ? `, with historical performance demonstrating the fund's ability to achieve its objectives` : ''}. However, past performance is not indicative of future results. The fund's investments carry inherent market risks. Capital is at risk, and investors should carefully consider their investment objectives and risk tolerance.`
    }
  ];

  // Use fund-specific FAQs if available, otherwise use default FAQs
  const activeFAQs = (fund as any).faqs && (fund as any).faqs.length > 0 ? (fund as any).faqs : defaultFAQs;

  // Entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-5');
          }
        });
      },
      { threshold: 0.1 }
    );

    faqRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [activeFAQs]);

  // Schema markup
  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': activeFAQs.map((faq: FAQItem) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    const existingFAQSchema = document.querySelector('script[data-schema="faq"]');
    if (existingFAQSchema) {
      existingFAQSchema.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const schemaScript = document.querySelector('script[data-schema="faq"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [activeFAQs]);

  if (activeFAQs.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto max-w-4xl" itemScope itemType="https://schema.org/FAQPage">
      {/* Section Header */}
      <div className="mb-10">
        <h2 className="text-[32px] font-semibold tracking-tight leading-tight mb-3">
          Frequently Asked Questions about {fund.name}
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl">
          Everything you need to know about investing in {fund.name}
        </p>
      </div>

      {/* FAQ List */}
      <div className="flex flex-col gap-8">
        {activeFAQs.map((faq: FAQItem, index: number) => (
          <div
            key={index}
            ref={(el) => (faqRefs.current[index] = el)}
            className="bg-card border border-border/40 rounded-xl p-8 shadow-sm hover:border-primary/20 hover:shadow-lg transition-all duration-200 opacity-0 translate-y-5"
            style={{
              transitionDelay: `${index * 0.1}s`
            }}
            itemScope
            itemType="https://schema.org/Question"
          >
            {/* Question */}
            <h3 
              className="text-xl font-semibold tracking-tight leading-relaxed mb-4"
              itemProp="name"
            >
              {faq.question}
            </h3>

            {/* Answer */}
            <div 
              className="text-base text-muted-foreground leading-relaxed"
              itemScope
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">
                {faq.answer.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className={pIndex < faq.answer.split('\n\n').length - 1 ? 'mb-3' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FundFAQSection;
