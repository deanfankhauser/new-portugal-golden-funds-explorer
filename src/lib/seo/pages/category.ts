import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas';
import { checkCategoryIndexability } from '@/lib/indexability';
import { calculateCategoryStatistics } from '@/utils/categoryStatistics';
import { pluralize } from '@/utils/textHelpers';

export function getCategorySeo(categoryName: string, funds: Fund[] = []): SEOData {
  const indexability = checkCategoryIndexability(categoryName, funds);
  
  // Title per new format: "{Category} Portugal Golden Visa Funds (2026) | Movingto Funds"
  const title = `${categoryName} Portugal Golden Visa Funds (2026) | Movingto Funds`;
  
  // Description per new format
  const description = `Explore ${categoryName} funds for the €500k route. Compare strategy, fees, liquidity terms, and timelines—built for shortlisting and due diligence.`;
  
  return {
    title: optimizeTitle(title),
    description: optimizeDescription(description),
    url: URL_CONFIG.buildCategoryUrl(categoryName),
    canonical: URL_CONFIG.buildCategoryUrl(categoryName),
    robots: indexability.robots,
    keywords: [
      `${categoryName} funds`,
      `${categoryName} Golden Visa`,
      'Portugal investment funds',
      `${categoryName} investment`,
      'Golden Visa funds',
      'CMVM regulated funds',
      `${categoryName} fund comparison`
    ],
    structuredData: getCategoryStructuredData(categoryName, funds)
  };
}

function generateCategoryFAQs(categoryName: string, funds: Fund[] = []): Array<{ question: string; answer: string }> {
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

function getCategoryStructuredData(categoryName: string, funds: Fund[] = []): any {
  const categoryUrl = URL_CONFIG.buildCategoryUrl(categoryName);
  
  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Categories', 'item': URL_CONFIG.buildUrl('/categories') },
      { '@type': 'ListItem', 'position': 3, 'name': categoryName, 'item': categoryUrl }
    ]
  };
  
  // Enhanced ItemList with FinancialProduct type for each fund
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${categoryName} Portugal Golden Visa Investment Funds`,
    'description': `Collection of ${categoryName} funds eligible for Portugal Golden Visa`,
    'url': categoryUrl,
    'numberOfItems': funds.length,
    'itemListElement': funds.map((fund, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'FinancialProduct',
        'name': fund.name,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'category': fund.category || categoryName,
        'description': fund.description || `${fund.name} - ${categoryName} investment fund for Portugal Golden Visa`,
        'offers': {
          '@type': 'Offer',
          'price': fund.minimumInvestment || 500000,
          'priceCurrency': 'EUR',
          'availability': 'https://schema.org/InStock'
        },
        'provider': {
          '@type': 'Organization',
          'name': fund.managerName || 'Fund Manager'
        },
        ...(fund.managementFee && {
          'annualPercentageRate': fund.managementFee
        })
      }
    }))
  };

  // CollectionPage schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${categoryName} Portugal Golden Visa Investment Funds`,
    'description': `Explore ${funds.length}+ ${categoryName} funds for Portugal Golden Visa residency`,
    'url': categoryUrl
  };

  // FAQPage schema for SEO
  const faqs = generateCategoryFAQs(categoryName, funds);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'name': `${categoryName} Golden Visa Funds FAQs`,
    'description': `Frequently asked questions about ${categoryName} investment funds for Portugal Golden Visa`,
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    collectionSchema,
    itemListSchema,
    faqSchema
  ];
}
