import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription, slugify } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getFundAlternativesSeo(fund: Fund): SEOData {
  const fundName = fund.name || 'Investment Fund';
  
  return {
    title: optimizeTitle(`${fundName} Alternatives | Portugal Golden Visa Funds | Movingto`),
    description: optimizeDescription(`Discover alternatives to ${fundName} for the Portugal Golden Visa. Compare similar funds by strategy, minimum investment, target returns, and risk profile.`),
    url: URL_CONFIG.buildFundAlternativesUrl(fund.id),
    canonical: URL_CONFIG.buildFundUrl(fund.id),
    robots: 'noindex,follow',
    keywords: [
      `${fundName} alternatives`,
      'similar funds',
      'comparable investment funds',
      'alternative Golden Visa funds',
      `${fund.category || 'investment'} alternatives`,
      'fund substitutes Portugal'
    ],
    structuredData: getFundAlternativesStructuredData(fund)
  };
}

function getFundAlternativesStructuredData(fund: Fund): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': `Alternatives to ${fund.name}`,
    'description': `Similar Portugal Golden Visa funds to ${fund.name}`,
    'url': URL_CONFIG.buildFundAlternativesUrl(fund.id),
    'mainEntity': {
      '@type': 'FinancialProduct',
      'name': fund.name,
      'category': fund.category
    }
  };
}
