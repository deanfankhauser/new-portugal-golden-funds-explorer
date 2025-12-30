import React from 'react';
import FAQSection from '../common/FAQSection';
import { Fund } from '../../data/types/funds';
import { calculateCategoryStatistics } from '../../utils/categoryStatistics';
import { pluralize } from '../../utils/textHelpers';

interface FAQItem {
  question: string;
  answer: string;
}

interface CategoryPageFAQProps {
  categoryName: string;
  categorySlug: string;
  fundsCount: number;
  funds: Fund[];
}

const CategoryPageFAQ: React.FC<CategoryPageFAQProps> = ({ categoryName, categorySlug, fundsCount, funds }) => {
  const stats = calculateCategoryStatistics(funds);
  const fundWord = pluralize(fundsCount, 'fund');
  
  // Generate risk assessment based on category
  const getRiskAssessment = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('venture capital') || lowerCategory.includes('crypto') || lowerCategory.includes('bitcoin')) {
      return `${category} funds carry higher risk due to early-stage investments and market volatility. They target high-growth opportunities but can experience significant fluctuations. Suitable for investors with higher risk tolerance seeking capital appreciation.`;
    }
    
    if (lowerCategory.includes('debt') || lowerCategory.includes('credit')) {
      return `${category} funds generally offer lower risk compared to equity strategies. They focus on fixed-income instruments with predictable returns. Suitable for conservative investors seeking stable income streams.`;
    }
    
    if (lowerCategory.includes('real estate') || lowerCategory.includes('infrastructure')) {
      return `${category} funds typically offer moderate risk with tangible asset backing. They provide income through rent/fees plus potential capital appreciation. Suitable for investors seeking balanced risk-return profiles.`;
    }
    
    if (lowerCategory.includes('private equity')) {
      return `${category} funds offer balanced risk profiles, targeting mature companies with established cash flows. They combine income generation with capital appreciation potential. Suitable for investors seeking middle-ground exposure between debt and venture capital.`;
    }
    
    return `${category} funds vary in risk depending on underlying assets and strategies. Review individual fund risk profiles, historical performance, and investment mandates to assess suitability for your risk tolerance.`;
  };

  // Calculate average return with proper formatting
  const getAverageReturnAnswer = (): string => {
    if (fundsCount === 0) {
      return `We are currently updating our ${categoryName.toLowerCase()} fund listings. Check back soon for the latest options.`;
    }
    
    if (stats.avgTargetReturn === null) {
      return `Average return data is not currently available for all ${categoryName} funds. Individual fund target returns vary based on strategy, risk profile, and market conditions. Review each fund's disclosed performance targets and historical track record when evaluating options.`;
    }
    
    const formattedReturn = stats.avgTargetReturn.toFixed(1);
    return `Based on disclosed data from ${fundsCount} active ${categoryName.toLowerCase()} ${fundWord}, the average target return is approximately ${formattedReturn}% per annum. However, individual fund returns vary significantly based on strategy, risk profile, and market conditions. Always review each fund's specific performance targets, historical track record, and risk factors before investing.`;
  };
  
  // Handle zero-count case for GV eligible question
  const getGVEligibleAnswer = (): string => {
    if (fundsCount === 0) {
      return `We are currently updating our ${categoryName.toLowerCase()} fund directory. Check back soon for Golden Visa eligible options.`;
    }
    return `Currently, ${stats.gvEligibleCount} of the ${fundsCount} ${categoryName.toLowerCase()} ${fundWord} in our directory are explicitly tagged as Golden Visa Eligible. These funds have been verified to meet Portugal's Golden Visa investment criteria, including CMVM regulation, minimum investment thresholds, and qualification requirements. Review each fund's eligibility documentation and consult with legal advisors to confirm Golden Visa qualification for your specific circumstances.`;
  };

  const faqs: FAQItem[] = [
    {
      question: `Are ${categoryName} funds safe?`,
      answer: getRiskAssessment(categoryName)
    },
    {
      question: `What is the average return for ${categoryName} funds?`,
      answer: getAverageReturnAnswer()
    },
    {
      question: `How many ${categoryName} funds are Golden Visa eligible?`,
      answer: getGVEligibleAnswer()
    }
  ];

  return (
    <FAQSection 
      faqs={faqs}
      title={`Frequently Asked Questions about ${categoryName} Portugal Golden Visa Investment Funds`}
      schemaId="category-faq"
    />
  );
};

export default CategoryPageFAQ;
