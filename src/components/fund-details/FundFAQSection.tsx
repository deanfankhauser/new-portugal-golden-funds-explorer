import React from 'react';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';
import { Fund } from '../../data/types/funds';
import { formatManagementFee, formatPerformanceFee, formatSubscriptionFee } from '../../utils/feeFormatters';

interface FundFAQSectionProps {
  fund: Fund;
}

// Generate system FAQs based on fund data
const generateSystemFAQs = (fund: Fund): FAQItem[] => {
  const systemFAQs: FAQItem[] = [];
  
  // FAQ 1: CMVM Regulation
  if (fund.cmvmId) {
    systemFAQs.push({
      question: `Is ${fund.name} CMVM regulated?`,
      answer: `Yes, it is registered under CMVM ID ${fund.cmvmId}.${fund.custodian ? ` The custodian is ${fund.custodian}.` : ''}`
    });
  }
  
  // FAQ 2: Total Fees
  const mgmtFee = formatManagementFee(fund.managementFee);
  const perfFee = formatPerformanceFee(fund.performanceFee);
  const subFee = formatSubscriptionFee(fund.subscriptionFee);
  
  systemFAQs.push({
    question: `What are the total fees for ${fund.name}?`,
    answer: `Management Fee: ${mgmtFee}. Performance Fee: ${perfFee}. Subscription Fee: ${subFee}.`
  });
  
  // FAQ 3: Golden Visa (only if GV tagged AND verified)
  if (fund.tags?.includes('Golden Visa Eligible') && fund.isVerified) {
    systemFAQs.push({
      question: `Is ${fund.name} marketed for the 2025 Golden Visa route?`,
      answer: `Yes, the fund manager states that ${fund.name} is intended to meet the €500,000 fund route requirement for the Portugal Golden Visa program. Eligibility must be confirmed with Portuguese legal counsel.`
    });
  }
  
  return systemFAQs;
};

// Check if manual FAQs already cover fee-related topics
const hasFeeRelatedQuestion = (faqs: FAQItem[]): boolean => {
  const feeKeywords = ['fee', 'fees', 'cost', 'costs', 'charges', 'pricing'];
  return faqs.some(faq => 
    feeKeywords.some(keyword => 
      faq.question.toLowerCase().includes(keyword)
    )
  );
};

// Filter out system FAQs that duplicate manual FAQ topics
const filterDuplicateSystemFAQs = (
  manualFAQs: FAQItem[], 
  systemFAQs: FAQItem[]
): FAQItem[] => {
  return systemFAQs.filter(systemFaq => {
    if (systemFaq.question.toLowerCase().includes('fees') && hasFeeRelatedQuestion(manualFAQs)) {
      return false;
    }
    return true;
  });
};

const FundFAQSection: React.FC<FundFAQSectionProps> = ({ fund }) => {
  // Default FAQs if none provided in fund data
  const defaultFAQs: FAQItem[] = [
    {
      question: `What makes ${fund.name} unique?`,
      answer: `${fund.name} offers a distinctive investment approach with carefully selected strategies designed to achieve optimal returns while managing risk. The fund combines experienced management with rigorous investment processes to deliver value to investors.`
    },
    {
      question: `How is risk managed?`,
      answer: `${fund.name} employs a multi-layered risk management approach designed to protect capital while pursuing growth opportunities. This includes asset diversification, rigorous selection processes, regular portfolio rebalancing, and professional oversight by experienced managers with proven track records.`
    },
    {
      question: `What are the investment requirements?`,
      answer: `The minimum investment for ${fund.name} is ${fund.minimumInvestment ? `€${fund.minimumInvestment.toLocaleString()}` : 'available upon request'}. The fund features ${fund.redemptionTerms?.frequency || 'periodic'} redemptions with ${fund.redemptionTerms?.minimumHoldingPeriod ? `a ${fund.redemptionTerms.minimumHoldingPeriod}-month` : 'a'} lock-up period. ${fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod} days notice` : 'Advance notice'} is required for redemptions.`
    },
    {
      question: fund.tags?.includes('Golden Visa Eligible') && fund.isVerified
        ? `Is this fund intended for Golden Visa applicants?`
        : `What are the regulatory requirements?`,
      answer: fund.tags?.includes('Golden Visa Eligible') && fund.isVerified
        ? `The fund manager states that ${fund.name} is intended for the Portugal Golden Visa program. By investing the minimum amount, you may be eligible to apply for Portuguese residency through the Golden Visa program—subject to verification by Portuguese legal counsel. The fund maintains compliance with CMVM regulations${fund.cmvmId ? ` and is registered under CMVM #${fund.cmvmId}` : ''}.`
        : `${fund.name} operates under regulatory oversight${fund.regulatedBy ? ` by ${fund.regulatedBy}` : ''}${fund.cmvmId ? ` and is registered with CMVM #${fund.cmvmId}` : ''}. The fund maintains full compliance with all applicable securities regulations and reporting requirements.`
    },
    {
      question: `What are the expected returns?`,
      answer: `${fund.name} ${fund.returnTarget ? `targets ${fund.returnTarget}` : 'aims to deliver competitive returns'}${fund.historicalPerformance ? `, with historical performance demonstrating the fund's ability to achieve its objectives` : ''}. However, past performance is not indicative of future results. The fund's investments carry inherent market risks. Capital is at risk, and investors should carefully consider their investment objectives and risk tolerance.`
    }
  ];

  // Source A: Manual FAQs from database
  const manualFAQs: FAQItem[] = (fund as any).faqs || [];
  
  // Source B: System-generated FAQs
  const allSystemFAQs = generateSystemFAQs(fund);
  
  // Apply duplicate protection
  const filteredSystemFAQs = filterDuplicateSystemFAQs(manualFAQs, allSystemFAQs);
  
  // If no manual FAQs, use existing default fallback FAQs instead
  const effectiveManualFAQs = manualFAQs.length > 0 ? manualFAQs : defaultFAQs;

  return (
    <UniversalFAQ 
      faqs={effectiveManualFAQs}
      systemFaqs={filteredSystemFAQs}
      title="Frequently Asked Questions"
      schemaId="fund-faq"
      skipStructuredData={true}
    />
  );
};

export default FundFAQSection;
