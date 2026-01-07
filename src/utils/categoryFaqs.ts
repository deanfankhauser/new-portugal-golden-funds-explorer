import { Fund } from '@/data/types/funds';
import { calculateCategoryStatistics } from './categoryStatistics';
import { pluralize } from './textHelpers';

export interface CategoryFAQ {
  question: string;
  answer: string;
}

// Crypto category has custom, hand-crafted FAQs
const CRYPTO_CATEGORY_FAQS: CategoryFAQ[] = [
  {
    question: "Are crypto Portugal Golden Visa investment funds eligible as Golden Visa funds?",
    answer: "Some crypto Portugal Golden Visa investment funds may be eligible as Golden Visa funds, but eligibility depends on the fund's structure and whether it meets Portugal's Golden Visa investment requirements. A fund being \"crypto\" or \"blockchain\" themed does not automatically make it an eligible Portugal Golden Visa investment fund. Always confirm eligibility with Portuguese legal counsel before investing."
  },
  {
    question: "Does crypto qualify for the Portugal Golden Visa without Portugal Golden Visa investment funds?",
    answer: "No. Holding or purchasing cryptocurrency directly (e.g., Bitcoin or tokens on an exchange) does not qualify for the program. The common \"fund route\" requires investing in Portugal Golden Visa investment funds (often called Golden Visa funds) that meet the Golden Visa investment rules and can provide appropriate documentation for your application."
  },
  {
    question: "What does CMVM-regulated mean for Portugal Golden Visa investment funds (Golden Visa funds)?",
    answer: "\"CMVM-regulated\" generally means the fund/manager is operating under Portugal's regulated investment framework. For Portugal Golden Visa investment funds, regulation can be a positive signal for governance and oversight. But CMVM regulation alone does not guarantee a fund is eligible as a Golden Visa fund—Golden Visa eligibility still depends on the rules and the fund's documents."
  },
  {
    question: "How do crypto Golden Visa funds differ from blockchain/fintech Portugal Golden Visa investment funds?",
    answer: "Some crypto Golden Visa funds invest directly in crypto-linked strategies (tokens, trading, infrastructure exposures), while blockchain/fintech Portugal Golden Visa investment funds may invest more traditionally (e.g., equity in companies) but with a \"crypto/blockchain\" theme. The difference matters for risk profile, liquidity, valuation, fees, and how performance is reported—all critical when comparing Golden Visa funds."
  },
  {
    question: "Are crypto Golden Visa funds safe compared to other Portugal Golden Visa investment funds?",
    answer: "Generally, crypto Golden Visa funds are higher risk than many other Portugal Golden Visa investment funds because crypto markets can be volatile and liquidity can change quickly. There can also be added operational risks such as custody, counterparty exposure, and fast-moving regulation. If you choose crypto-focused Golden Visa funds, assume higher risk unless the fund documents clearly show strong controls and conservative exposure."
  },
  {
    question: "How do crypto Golden Visa funds handle custody and asset valuation?",
    answer: "Custody and valuation differ across crypto Golden Visa funds. Some use institutional custodians; others may use different custody arrangements. Valuation can be more complex when assets are thinly traded, early-stage, or have limited price discovery. When assessing Portugal Golden Visa investment funds in the crypto category, look for clear disclosure on custody arrangements, valuation methodology, independent administration, and audit practices."
  },
  {
    question: "What is the minimum investment for Portugal Golden Visa investment funds in the crypto category?",
    answer: "For the Portugal Golden Visa \"fund route,\" investors commonly work around the €500,000 level (subject to current rules and legal interpretation). Some Portugal Golden Visa investment funds may have higher minimum subscriptions depending on the strategy and the manager. Confirm the current Golden Visa threshold and the fund's subscription minimum with Portuguese legal counsel and the fund manager."
  },
  {
    question: "How long does it take to invest in Golden Visa funds for the Portugal Golden Visa?",
    answer: "Investing in Golden Visa funds typically involves onboarding/KYC, signing subscription documents, transferring funds, unit issuance, and producing proof of investment for the application file. For Portugal Golden Visa investment funds, timelines vary by manager, banking, and KYC complexity—often weeks rather than days, especially when cross-border banking is involved."
  },
  {
    question: "What documents should I review before investing in crypto Portugal Golden Visa investment funds?",
    answer: "Before investing in crypto Portugal Golden Visa investment funds (Golden Visa funds), you should review the fund's core documents and ensure the manager can provide the paperwork typically needed for a Golden Visa file. Focus on: strategy and permitted assets; fees and total cost structure; liquidity/lock-up and redemption terms; custody and operational setup; valuation method and reporting frequency; risk disclosures specific to crypto exposure. And confirm Golden Visa eligibility with Portuguese legal counsel."
  },
  {
    question: "Does Movingto Funds give investment advice or recommend Golden Visa funds?",
    answer: "No. Movingto Funds is an information and introduction platform for Portugal Golden Visa investment funds (Golden Visa funds). We help people compare Golden Visa funds and connect with fund managers and Portuguese legal counsel, but we do not provide investment advice and we do not recommend that you invest in any specific Portugal Golden Visa investment fund."
  }
];

function generateDefaultCategoryFAQs(categoryName: string, funds: Fund[]): CategoryFAQ[] {
  const stats = calculateCategoryStatistics(funds);
  const fundsCount = funds.length;
  const fundWord = pluralize(fundsCount, 'fund');
  
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
  
  const getGVIntendedAnswer = (): string => {
    if (fundsCount === 0) {
      return `We are currently updating our ${categoryName.toLowerCase()} fund directory. Check back soon for funds marketed for the Golden Visa route.`;
    }
    return `Currently, ${stats.gvEligibleCount} of the ${fundsCount} ${categoryName.toLowerCase()} ${fundWord} in our directory are marketed as GV-intended (per manager statements). These funds have documentation indicating intent to meet Portugal's Golden Visa investment criteria. Eligibility must be confirmed with Portuguese legal counsel.`;
  };

  return [
    { question: `Are ${categoryName} funds safe?`, answer: getRiskAssessment(categoryName) },
    { question: `What is the average return for ${categoryName} funds?`, answer: getAverageReturnAnswer() },
    { question: `How many ${categoryName} funds are marketed for Golden Visa?`, answer: getGVIntendedAnswer() }
  ];
}

export function getCategoryFAQs(categoryName: string, funds: Fund[] = []): CategoryFAQ[] {
  const normalizedCategory = categoryName.toLowerCase().trim();
  
  // Return custom FAQs for specific categories
  if (normalizedCategory === 'crypto' || normalizedCategory === 'cryptocurrency') {
    return CRYPTO_CATEGORY_FAQS;
  }
  
  // Default: generate FAQs based on category statistics
  return generateDefaultCategoryFAQs(categoryName, funds);
}
