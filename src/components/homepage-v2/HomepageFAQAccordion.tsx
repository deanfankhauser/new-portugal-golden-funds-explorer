import React from 'react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';

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
    <UniversalFAQ 
      faqs={HOMEPAGE_FAQS}
      title="Frequently Asked Questions"
      subtitle="Quick answers about the Portugal Golden Visa fund route"
      schemaId="homepage-faq"
      variant="card-wrapped"
      skipStructuredData={true}
      showViewAllLink={true}
      viewAllHref="/faqs"
      viewAllLabel="View All FAQs"
    />
  );
};

export default HomepageFAQAccordion;
