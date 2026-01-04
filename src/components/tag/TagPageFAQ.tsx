import React from 'react';
import FAQSection from '../common/FAQSection';
import { isTagGVEligible } from '../../data/services/gv-eligibility-service';
import { pluralize } from '../../utils/textHelpers';

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
    const fundWord = pluralize(count, 'fund');
    
    // Handle zero-count case with appropriate messaging
    const getCountAnswer = (): string => {
      if (count === 0) {
        return `We are currently updating our ${tag.toLowerCase()} fund listings. Check back soon for the latest options, or explore related investment themes in the meantime.`;
      }
      return `Currently, there are ${count} ${tag.toLowerCase()} ${fundWord} available in our directory that are marketed for the Portugal Golden Visa route (per manager statements). Each fund should be verified with Portuguese legal counsel to confirm eligibility.`;
    };
    
    return [
      {
        question: `What are ${tag} Golden Visa investment funds?`,
        answer: isEligible 
          ? `${tag} Golden Visa investment funds are specialized investment vehicles that focus on ${tag.toLowerCase()} sectors and are marketed for Portugal's Golden Visa program (per manager statements). These funds allow non-EU investors to potentially obtain Portuguese residency by investing €500,000 or more in ${tag.toLowerCase()} investment opportunities—subject to verification by Portuguese legal counsel.`
          : `${tag} investment funds focus on ${tag.toLowerCase()} sectors but are NOT marketed for Portugal's Golden Visa program since October 2023. Real estate-linked funds were excluded from the Golden Visa program due to regulatory changes.`
      },
      {
        question: `How many ${tag} funds are marketed for Golden Visa?`,
        answer: getCountAnswer()
      },
      {
        question: `What is the minimum investment for ${tag} Golden Visa funds?`,
        answer: `Portugal Golden Visa fund route requires €500,000 total investment (post-October 2023 regulatory changes), with no real estate exposure permitted. Individual ${tag.toLowerCase()} fund subscription minimums may be lower, but total qualifying investment must reach €500,000. Eligibility must be confirmed with Portuguese legal counsel.`
      },
      {
        question: `Are ${tag} Golden Visa funds safe investments?`,
        answer: `${tag} funds marketed for the Golden Visa are regulated investment vehicles subject to oversight. While all investments carry risk, these funds must demonstrate their ability to support Portugal's economic development goals in the ${tag.toLowerCase()} sector. Consult with legal and financial advisors before investing.`
      },
      {
        question: `How long do I need to hold my investment in ${tag} Golden Visa funds?`,
        answer: `For Golden Visa purposes, you must maintain your investment in ${tag} funds for a minimum of 5 years. After this period, you may be eligible for permanent residency or citizenship, depending on other requirements such as language proficiency and time spent in Portugal. Confirm all requirements with Portuguese legal counsel.`
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
    />
  );
};

export default TagPageFAQ;
