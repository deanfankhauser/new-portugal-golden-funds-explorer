import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'What is the €500k fund route for Portugal Golden Visa?',
    answer: 'The €500k fund route allows investors to qualify for a Portugal Golden Visa by investing €500,000 or more in a qualifying investment fund regulated by CMVM (Portuguese Securities Market Commission). This is one of the most popular paths to Portuguese residency for non-EU investors.'
  },
  {
    question: 'How long is the investment typically held?',
    answer: 'Most Golden Visa funds have investment terms of 5-10 years to align with fund strategy and residency requirements. Lock-up periods vary by fund—some offer quarterly or annual redemption windows, while others require holding until fund maturity.'
  },
  {
    question: 'Are returns guaranteed on Golden Visa funds?',
    answer: 'No. Investment returns are never guaranteed. Fund performance depends on market conditions, fund strategy, and management execution. Past performance does not guarantee future results. Always review risk disclosures in official fund documents.'
  },
  {
    question: 'What fees are typical for Golden Visa funds?',
    answer: 'Typical fees include: Management fees (1-2.5% annually), Performance fees (10-20% of profits above a hurdle rate), and sometimes Subscription fees (0-3% upfront). Some funds also charge redemption fees for early exit. Always verify the complete fee schedule in the fund prospectus.'
  },
  {
    question: 'Are Golden Visa funds "safer" than property investment?',
    answer: 'Fund and property investments have different risk profiles. Funds offer professional management and diversification but carry market risk. Property offers tangible assets but requires more hands-on management and carries illiquidity risk. Neither is inherently "safer"—the right choice depends on your circumstances and risk tolerance.'
  },
  {
    question: 'Can US citizens invest in Portugal Golden Visa funds?',
    answer: 'Some funds accept US citizens, but many do not due to regulatory complexity (FATCA compliance, PFIC reporting requirements). If you are a US person, look for funds explicitly marked as US-compliant or PFIC-compliant, and consult a cross-border tax advisor.'
  },
  {
    question: 'How do I verify CMVM registration?',
    answer: 'You can verify fund registration on the official CMVM website (cmvm.pt) by searching for the fund name or CMVM registration number. All qualifying Golden Visa funds must be registered with CMVM. We display CMVM IDs where available.'
  },
  {
    question: 'What happens at fund maturity?',
    answer: 'At maturity, the fund manager liquidates investments and distributes proceeds to investors. The timeline depends on asset types—some funds may take 1-2 years to fully exit positions. Your capital return depends on fund performance and exit conditions.'
  },
  {
    question: 'How do I start the Golden Visa fund investment process?',
    answer: 'Typically: 1) Research and shortlist funds that match your criteria, 2) Contact fund managers or authorized distributors, 3) Complete subscription documents and KYC/AML checks, 4) Transfer funds, 5) Receive confirmation of investment, 6) Apply for Golden Visa with proof of investment. The whole process usually takes 2-4 months.'
  },
  {
    question: 'What is a UCITS fund?',
    answer: 'UCITS (Undertakings for Collective Investment in Transferable Securities) is an EU regulatory framework for investment funds. UCITS funds meet strict diversification and liquidity requirements, offering additional investor protections. Not all Golden Visa funds are UCITS—some are Alternative Investment Funds (AIFs) with different rules.'
  }
];

const BestFundsFAQ: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Frequently Asked Questions
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`faq-${index}`}
            className="border border-border/60 rounded-lg px-6 bg-card data-[state=open]:bg-muted/20"
          >
            <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Have more questions?{' '}
          <Link to="/faqs" className="text-primary hover:underline">
            View our complete FAQ section
          </Link>
          {' '}or{' '}
          <Link to="/contact" className="text-primary hover:underline">
            get in touch
          </Link>.
        </p>
      </div>
    </section>
  );
};

export default BestFundsFAQ;
