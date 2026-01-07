import React from 'react';
import FAQSection from '../common/FAQSection';
import { Fund } from '../../data/types/funds';
import { getCategoryFAQs } from '../../utils/categoryFaqs';

interface CategoryPageFAQProps {
  categoryName: string;
  categorySlug: string;
  fundsCount: number;
  funds: Fund[];
}

const CategoryPageFAQ: React.FC<CategoryPageFAQProps> = ({ categoryName, categorySlug, fundsCount, funds }) => {
  const faqs = getCategoryFAQs(categoryName, funds);

  return (
    <FAQSection 
      faqs={faqs}
      title={`Frequently Asked Questions about ${categoryName} Portugal Golden Visa Investment Funds`}
      schemaId="category-faq"
      skipStructuredData={true}
    />
  );
};

export default CategoryPageFAQ;
