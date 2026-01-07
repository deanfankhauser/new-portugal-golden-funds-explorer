import React from 'react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';

const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "What are Portugal Golden Visa investment funds (Golden Visa funds)?",
    answer: "Portugal Golden Visa investment funds (often called Golden Visa funds) are regulated Portuguese investment funds that investors can subscribe to as part of the Portugal Golden Visa \"fund route.\" Instead of buying property, you invest in fund units and use the subscription documents as part of your Golden Visa application file. Eligibility depends on the fund's structure and documentation, so it must be confirmed by Portuguese legal counsel."
  },
  {
    question: "Are these funds eligible Portugal Golden Visa investment funds?",
    answer: "Funds listed on Movingto Funds are presented as Portugal Golden Visa investment funds based on manager disclosures and available documentation. However, Golden Visa eligibility is a legal determination, and your Portuguese lawyer should confirm eligibility for your specific case before you invest. If you request an introduction, we can connect you with the fund manager and our Portugal Golden Visa legal team to confirm requirements."
  },
  {
    question: "What's the minimum investment for the Portugal Golden Visa fund route?",
    answer: "The commonly referenced minimum for the Portugal Golden Visa fund route is €500,000 invested into qualifying Portugal Golden Visa investment funds (Golden Visa funds). Requirements can change and may depend on your legal approach and the fund's subscription terms, so confirm with Portuguese legal counsel before proceeding."
  },
  {
    question: "Are Portugal Golden Visa investment funds regulated in Portugal?",
    answer: "Most Portugal Golden Visa investment funds are structured under Portugal's regulated investment framework and typically involve regulated entities (e.g., fund managers, administrators, depositaries/custodians). Regulation is an important trust signal—but regulation alone does not guarantee Golden Visa eligibility, which must be confirmed through legal review of the fund documentation."
  },
  {
    question: "What does \"Verified\" mean on Movingto Funds?",
    answer: "\"Verified\" means Movingto Funds has reviewed a defined set of claims about a fund (based on documents and confirmations we request), and we show exactly what was verified on the fund page. Verification is designed to reduce ambiguity when comparing Golden Visa funds, but it is not legal advice and not a guarantee of Golden Visa approval. Your Portuguese lawyer should still confirm eligibility and suitability for your situation."
  },
  {
    question: "What fees should I pay attention to with Golden Visa funds?",
    answer: "When comparing Golden Visa funds and Portugal Golden Visa investment funds, focus on the fees that actually impact your net outcome: subscription/entry fees (if any), annual management fees, performance fees (how calculated, hurdles, catch-ups), fund expenses (administration, custody/depositary, audit, legal), and exit/redemption fees (if any). We surface key terms where available, but you should always review the fund's official documents."
  },
  {
    question: "What are typical lock-up and redemption terms for Portugal Golden Visa investment funds?",
    answer: "Many Portugal Golden Visa investment funds have lock-ups and limited redemption windows, especially if the strategy is private equity/venture/debt. Some funds allow redemptions only after a minimum period; others rely on fund maturity and asset sales. Always check: lock-up length, redemption frequency, notice periods, gates, and whether liquidity is \"best efforts.\""
  },
  {
    question: "How long does it take to invest in Golden Visa funds and start the Golden Visa process?",
    answer: "Investing in Golden Visa funds typically involves onboarding/KYC, signing subscription documents, transferring capital, unit issuance, and obtaining proof of investment for your Portugal Golden Visa file. Timelines vary by bank/KYC complexity and fund processes, but a realistic expectation is weeks rather than days."
  },
  {
    question: "How does Movingto Funds make money, and are you independent?",
    answer: "Movingto Funds is not an independent advisor. We may receive a referral/introductory commission from some fund managers if you invest, and we may also earn fees for legal or support services if you engage our team. We disclose this clearly, and we do not provide investment advice. Our role is to help you compare Portugal Golden Visa investment funds (Golden Visa funds) and connect you with the right people to complete the process."
  },
  {
    question: "How do I request a Golden Visa fund introduction?",
    answer: "Click Request introduction on any fund page or use the homepage form. Tell us your timeline, citizenship, and general preferences (risk, liquidity, strategy). We'll connect you with the fund manager and—if you want—our Portugal Golden Visa legal team to confirm eligibility and next steps."
  },
  {
    question: "Is this investment advice?",
    answer: "No. Movingto Funds provides information and introductions for Golden Visa funds and Portugal Golden Visa investment funds. We do not provide investment advice or recommend that you invest in any specific fund. Always obtain independent financial advice and Portuguese legal advice before investing."
  }
];

const HomepageFAQAccordion: React.FC = () => {
  return (
    <UniversalFAQ 
      faqs={HOMEPAGE_FAQS}
      title="Frequently Asked Questions"
      subtitle="Quick answers about Golden Visa funds and the Portugal Golden Visa fund route"
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
