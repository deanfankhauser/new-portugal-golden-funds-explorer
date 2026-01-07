import React from 'react';
import FAQSection from '../common/FAQSection';
import { getTagFAQs } from '@/utils/tagFaqs';
import { Fund } from '@/data/types/funds';

interface TagPageFAQProps {
  tagName: string;
  tagSlug: string;
  fundsCount: number;
  funds: Fund[];
}

const TagPageFAQ: React.FC<TagPageFAQProps> = ({ tagName, tagSlug, fundsCount, funds }) => {
  const faqs = getTagFAQs(tagName, funds);

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
