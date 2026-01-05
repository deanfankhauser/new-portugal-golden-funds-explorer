import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription, slugify } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas/sitewideSchemas';
import { BREADCRUMB_CONFIGS } from '../schemas/breadcrumbSchema';

export function getFundAlternativesSeo(fund: Fund): SEOData {
  const fundName = fund.name || 'Investment Fund';
  
  return {
    title: optimizeTitle(`Funds Similar to ${fundName} (2026) | Movingto Funds`),
    description: optimizeDescription(`Find funds with similar strategy and terms to ${fundName}. Compare fees, maturity, and liquidity side-by-side to shortlist options.`),
    url: URL_CONFIG.buildFundAlternativesUrl(fund.id),
    canonical: URL_CONFIG.buildFundAlternativesUrl(fund.id),
    robots: 'index, follow',
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

function getFundAlternativesStructuredData(fund: Fund): any[] {
  return [
    ...getSitewideSchemas(),
    BREADCRUMB_CONFIGS.fundAlternatives(fund.name, fund.id),
    {
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
    }
  ];
}
