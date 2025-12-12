import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription, slugify } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getFundAlternativesSeo(fund: Fund): SEOData {
  return {
    title: optimizeTitle(`${fund.name} Alternatives | Similar Portugal Golden Visa Funds | Movingto`),
    description: optimizeDescription(`Discover investment alternatives to ${fund.name}. Compare similar Portugal Golden Visa eligible funds with matching investment profiles and characteristics.`),
    url: URL_CONFIG.buildFundUrl(fund.id),
    canonical: URL_CONFIG.buildFundUrl(fund.id),
    robots: 'noindex,follow',
    keywords: [
      `${fund.name} alternatives`,
      'similar funds',
      'comparable investment funds',
      'alternative Golden Visa funds',
      `${fund.category} alternatives`,
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
