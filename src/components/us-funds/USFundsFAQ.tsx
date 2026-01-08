import React from 'react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';

const faqItems: FAQItem[] = [
  {
    question: 'Do Portugal Golden Visa funds accept US citizens?',
    answer: 'Some Portugal Golden Visa investment funds (Golden Visa funds) accept US citizens, and some don\'t. The limiting factors are usually U.S. compliance requirements (FATCA), a fund\'s internal policy, and whether their service providers are set up to onboard "U.S. persons." The only way to know is to confirm the fund\'s US-person policy before you start onboarding.'
  },
  {
    question: 'What does FATCA mean in this context?',
    answer: 'FATCA (Foreign Account Tax Compliance Act) is a U.S. reporting regime that requires many non-U.S. financial institutions to identify and report certain information about U.S. account holders/investors. In the context of Portugal Golden Visa investment funds, FATCA can add extra onboarding steps (forms, declarations, reporting classifications) and it\'s one reason some Golden Visa funds choose not to accept U.S. persons.'
  },
  {
    question: 'What extra documents are common for US persons?',
    answer: 'US citizens investing in Golden Visa funds are commonly asked for extra compliance and tax documentation. Exact requirements vary by fund administrator and bank.',
    bullets: [
      'W-9 (U.S. taxpayer identification form)',
      'Proof of TIN/SSN',
      'FATCA self-certification / U.S. person declarations',
      'More detailed source-of-funds evidence (bank statements, sale contracts, dividend statements, etc.)',
      'Sometimes additional KYC around address history and tax residency'
    ]
  },
  {
    question: 'Are returns guaranteed?',
    answer: 'No. Returns are not guaranteed for Portugal Golden Visa investment funds (Golden Visa funds). Funds can go up or down, and liquidity can be limited. Anyone implying guaranteed returns is a red flag—use the fund\'s official documents and independent advice instead.'
  },
  {
    question: 'What lock-up and redemption terms are typical?',
    answer: 'Many Golden Visa funds are not liquid like public ETFs. Some funds are effectively held until maturity/exits. Always read the terms—"typical" varies a lot.',
    bullets: [
      'Lock-ups (periods where you can\'t redeem)',
      'Redemptions only on specific windows (quarterly/annual) with notice periods',
      '"Best efforts" liquidity, gates, or limits on how much can be redeemed at once'
    ]
  },
  {
    question: 'How do I verify a fund is eligible for the €500k route?',
    answer: 'Treat eligibility as a legal confirmation, not a marketing claim. To verify a Portugal Golden Visa investment fund:',
    bullets: [
      'Confirm the fund is structured as an eligible Golden Visa fund for the program route you\'re using',
      'Ensure the subscription documents and proof-of-investment package meet what your lawyer needs for the application file',
      'Have Portuguese legal counsel confirm eligibility before you wire funds'
    ]
  },
  {
    question: 'What is PFIC and why do people mention it?',
    answer: 'PFIC stands for Passive Foreign Investment Company—a U.S. tax classification that can apply to many non-U.S. pooled investment vehicles. If a fund is a PFIC for U.S. tax purposes, it can trigger complex U.S. reporting and potentially unfavorable tax treatment unless handled correctly (and elections/reporting may be required). This is why US citizens should speak to a U.S. tax advisor before investing in Portugal Golden Visa investment funds.'
  },
  {
    question: 'Who should I speak to before investing?',
    answer: 'Before investing in Golden Visa funds, US citizens should typically speak to:',
    bullets: [
      'Portuguese immigration/legal counsel (Golden Visa eligibility + application strategy)',
      'A U.S. tax advisor (PFIC/FATCA implications, reporting, elections)',
      'An independent financial advisor (risk, liquidity, suitability)'
    ]
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
