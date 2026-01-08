import React from 'react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';

const faqItems: FAQItem[] = [
  {
    question: "Can I avoid PFIC classification for my Golden Visa fund?",
    answer: "Generally, no. Most Portugal Golden Visa investment funds meet the PFIC definition because they are foreign corporations with predominantly passive income or assets. The focus should be on managing the tax consequences through elections (QEF or MTM) rather than trying to avoid the classification."
  },
  {
    question: "What if my fund doesn't provide a PFIC Annual Information Statement?",
    answer: "Without a PFIC Annual Information Statement, you cannot make a QEF election and will be subject to the default excess distribution regime. Before investing, confirm with the fund manager whether they provide this statement. If they don't, discuss with your tax advisor whether the investment still makes sense given the tax treatment."
  },
  {
    question: "Do I need to file Form 8621 if I hold funds in an IRA?",
    answer: "PFIC investments held in qualified retirement accounts (traditional IRA, Roth IRA, 401(k)) are generally exempt from PFIC taxation and Form 8621 reporting. However, there are complexities around using IRA funds for Golden Visa investments, and not all self-directed IRA custodians support international fund investments. Consult both your tax advisor and IRA custodian."
  },
  {
    question: "What's the difference between FBAR and Form 8938?",
    answer: "FBAR (FinCEN Form 114) is filed with the Treasury Department and reports foreign financial accounts over $10,000. Form 8938 is filed with your tax return and reports foreign financial assets over higher thresholds ($50,000+). You may need to file both—they are not mutually exclusive and serve different enforcement purposes."
  },
  {
    question: "How do late QEF elections work?",
    answer: "If you miss the deadline to make a timely QEF election, there are procedures for late elections, including a 'purging election' that treats you as having sold and repurchased the PFIC shares. This triggers immediate recognition of gain under the excess distribution regime, but then allows QEF treatment going forward. The IRS also has consent procedures for late elections. This is complex—work with a tax advisor."
  },
  {
    question: "What are the penalties for non-compliance?",
    answer: "Penalties can be severe: FBAR non-willful violations can be $12,500+ per account per year; willful violations can be the greater of $100,000 or 50% of account value. Form 8938 penalties start at $10,000 per form. Form 8621 has a reasonable cause exception but can extend the statute of limitations indefinitely. Beyond penalties, you may lose the ability to make favorable elections."
  },
  {
    question: "How do currency conversions work for reporting?",
    answer: "The IRS requires amounts to be reported in USD. You should convert foreign currency amounts using the applicable exchange rate—generally the spot rate on the relevant date (year-end for valuations, distribution date for distributions). The IRS publishes yearly average rates that can sometimes be used. Keep records of the rates you use and be consistent."
  },
  {
    question: "What happens when the fund exits or I redeem?",
    answer: "When you receive proceeds from a fund exit or redemption, the tax treatment depends on what elections you've made. With a QEF election, gain is generally capital gain (and your basis is stepped up by prior income inclusions). Under the default regime, the excess distribution rules apply, potentially with interest charges. Plan for liquidity to pay taxes, as they may be due before you receive all proceeds."
  },
  {
    question: "Do I need a tax advisor who specializes in PFICs?",
    answer: "Yes, strongly recommended. PFIC rules are among the most complex in the U.S. tax code. A general tax preparer may not be familiar with PFIC elections, Form 8621, or how these interact with international reporting requirements. Look for a CPA or tax attorney with specific experience in foreign investments and international tax compliance."
  },
  {
    question: "How does dual citizenship or moving abroad affect my tax obligations?",
    answer: "U.S. citizens are taxed on worldwide income regardless of where they live. Moving abroad doesn't eliminate PFIC, FATCA, or FBAR obligations. If you acquire Portuguese citizenship or tax residency, you may have additional Portuguese tax obligations and potential treaty benefits to consider. This creates a complex multi-jurisdictional tax situation that requires coordinated advice."
  }
];

export const USTaxGuideFAQ: React.FC = () => {
  return (
    <section id="faq" className="scroll-mt-24">
      <UniversalFAQ
        faqs={faqItems}
        variant="compact"
        skipStructuredData={true}
        title="Frequently Asked Questions"
        subtitle="Common questions about U.S. tax implications for Golden Visa fund investors"
        schemaId="us-tax-guide-faq"
      />
    </section>
  );
};

export default USTaxGuideFAQ;
