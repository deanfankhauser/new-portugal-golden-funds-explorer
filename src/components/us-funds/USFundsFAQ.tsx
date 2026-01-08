import React from 'react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';

const faqItems: FAQItem[] = [
  {
    question: 'Do Portugal Golden Visa funds accept US citizens?',
    answer: 'Yes, some funds explicitly accept US persons, though fewer than for other nationalities. This page shows confirmed eligibility where available based on fund disclosures or manager confirmations. Always verify directly with the fund before proceeding.'
  },
  {
    question: 'What does FATCA mean in this context?',
    answer: 'FATCA (Foreign Account Tax Compliance Act) is a US law requiring foreign financial institutions to report information about accounts held by US taxpayers. Some Portugal-based funds are set up to handle FATCA reporting requirements, which makes them more accessible to US persons.'
  },
  {
    question: 'What extra documents are common for US persons?',
    answer: 'US persons typically need to provide: W-9 form (Request for Taxpayer Identification Number), proof of US taxpayer status, and additional AML/KYC documentation. The onboarding process may take longer than for non-US investors due to these extra compliance requirements.'
  },
  {
    question: 'Are returns guaranteed?',
    answer: 'No. Target returns shown on this platform are manager-stated projections, not guarantees. All investments carry risk, including the potential loss of principal. Past performance does not guarantee future results. Review official fund documents for complete risk disclosures.'
  },
  {
    question: 'What lock-up and redemption terms are typical?',
    answer: 'Most Golden Visa eligible funds have 5-7 year terms to align with the Golden Visa holding requirements. Redemption options vary significantly by fund structure—some offer quarterly windows while others only allow redemption at term end. Always check the specific fund\'s terms.'
  },
  {
    question: 'How do I verify a fund is eligible for the €500k route?',
    answer: 'Check the fund\'s CMVM registration status, confirm the fund\'s Golden Visa eligibility attestation in official documents, and verify with Portuguese legal counsel. The fund manager should provide documentation confirming eligibility for the investment-based Golden Visa route.'
  },
  {
    question: 'What is PFIC and why do people mention it?',
    answer: 'PFIC (Passive Foreign Investment Company) is a US tax classification that can result in unfavorable tax treatment for US investors in foreign funds. Some funds offer QEF (Qualified Electing Fund) elections that may provide more favorable treatment. This is a complex area—discuss the implications with your US tax advisor before investing.'
  },
  {
    question: 'Who should I speak to before investing?',
    answer: 'Before investing, consult: (1) A US-qualified tax advisor familiar with PFIC/FATCA implications, (2) Portuguese legal counsel for Golden Visa eligibility confirmation, and (3) A licensed financial advisor for investment suitability. These professionals can help you understand the full implications for your specific situation.'
  }
];

export const USFundsFAQ: React.FC = () => {
  return (
    <UniversalFAQ
      faqs={faqItems}
      title="FAQs for US citizens"
      schemaId="us-funds-faq"
      variant="compact"
      skipStructuredData={true}
    />
  );
};

export default USFundsFAQ;
