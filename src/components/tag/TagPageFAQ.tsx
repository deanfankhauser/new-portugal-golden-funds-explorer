import React from 'react';
import FAQSection from '../common/FAQSection';
import { isTagGVEligible } from '../../data/services/gv-eligibility-service';

interface FAQItem {
  question: string;
  answer: string;
}

interface TagPageFAQProps {
  tagName: string;
  tagSlug: string;
  fundsCount: number;
}

const TagPageFAQ: React.FC<TagPageFAQProps> = ({ tagName, tagSlug, fundsCount }) => {
  // Generate tag-specific FAQs
  const generateTagFAQs = (tag: string, count: number): FAQItem[] => {
    const isEligible = isTagGVEligible(tag as any);
    return [
      {
        question: `What are ${tag} Golden Visa investment funds?`,
        answer: isEligible 
          ? `${tag} Golden Visa investment funds are specialized investment vehicles that focus on ${tag.toLowerCase()} sectors and are eligible for Portugal's Golden Visa program. These funds allow non-EU investors to obtain Portuguese residency by investing €500,000 or more in qualified ${tag.toLowerCase()} investment opportunities.`
          : `${tag} investment funds focus on ${tag.toLowerCase()} sectors but are NOT eligible for Portugal's Golden Visa program since October 2023. Real estate-linked funds were excluded from the Golden Visa program due to regulatory changes.`
      },
      {
        question: `How many ${tag} Golden Visa funds are available?`,
        answer: `Currently, there are ${count} ${tag.toLowerCase()} funds available in our directory that are eligible for the Portugal Golden Visa program. Each fund has been verified to meet the program's requirements and investment criteria.`
      },
      {
        question: `What is the minimum investment for ${tag} Golden Visa funds?`,
        answer: `Portugal Golden Visa fund route requires €500,000 total investment (post-October 2023 regulatory changes), with no real estate exposure permitted. Individual ${tag.toLowerCase()} fund subscription minimums may be lower, but total qualifying investment must reach €500,000. Source: IMI Daily regulatory updates.`
      },
      {
        question: `Are ${tag} Golden Visa funds safe investments?`,
        answer: `${tag} Golden Visa funds are regulated investment vehicles that must meet strict criteria set by Portuguese authorities. While all investments carry risk, these funds are subject to regulatory oversight and must demonstrate their ability to support Portugal's economic development goals in the ${tag.toLowerCase()} sector.`
      },
      {
        question: `How long do I need to hold my investment in ${tag} Golden Visa funds?`,
        answer: `For Golden Visa eligibility, you must maintain your investment in ${tag} funds for a minimum of 5 years. After this period, you may be eligible for permanent residency or citizenship, depending on other requirements such as language proficiency and time spent in Portugal.`
      },
      {
        question: `Can I include family members in my ${tag} Golden Visa application?`,
        answer: `Yes, when investing in ${tag} Golden Visa funds, you can include your spouse, dependent children under 26, and dependent parents over 65 in your application. This makes the investment particularly attractive for families seeking EU residency.`
      }
    ];
  };

  const faqs = generateTagFAQs(tagName, fundsCount);

  return (
    <FAQSection 
      faqs={faqs}
      title={`Frequently Asked Questions about ${tagName} Portugal Golden Visa Investment Funds`}
      schemaId="tag-faq"
      skipStructuredData={true}
    />
  );
};

export default TagPageFAQ;
