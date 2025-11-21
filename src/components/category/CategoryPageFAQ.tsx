import React from 'react';
import FAQSection from '../common/FAQSection';

interface FAQItem {
  question: string;
  answer: string;
}

interface CategoryPageFAQProps {
  categoryName: string;
  categorySlug: string;
  fundsCount: number;
}

const CategoryPageFAQ: React.FC<CategoryPageFAQProps> = ({ categoryName, categorySlug, fundsCount }) => {
  // Generate category-specific FAQs
  const generateCategoryFAQs = (category: string, count: number): FAQItem[] => {
    return [
      {
        question: `What are ${category} Golden Visa investment funds?`,
        answer: `${category} Golden Visa investment funds are specialized investment vehicles that focus on ${category.toLowerCase()} sectors and are eligible for Portugal's Golden Visa program. These funds allow non-EU investors to obtain Portuguese residency by investing €500,000 or more in qualified ${category.toLowerCase()} investment opportunities.`
      },
      {
        question: `How many ${category} Golden Visa funds are available?`,
        answer: `Currently, there are ${count} ${category.toLowerCase()} funds available in our directory that are eligible for the Portugal Golden Visa program. Each fund has been verified to meet the program's requirements and investment criteria.`
      },
      {
        question: `What is the minimum investment for ${category} Golden Visa funds?`,
        answer: `The minimum investment for Golden Visa fund route is €500,000 total (post-October 2023 regulatory changes), regardless of category. Individual ${category.toLowerCase()} fund subscription minimums may vary, but total qualifying investment across one or more funds must reach €500,000. No real estate exposure permitted. Source: IMI Daily regulatory documentation.`
      }
    ];
  };

  const faqs = generateCategoryFAQs(categoryName, fundsCount);

  return (
    <FAQSection 
      faqs={faqs}
      title={`Frequently Asked Questions about ${categoryName} Portugal Golden Visa Investment Funds`}
      schemaId="category-faq"
    />
  );
};

export default CategoryPageFAQ;
