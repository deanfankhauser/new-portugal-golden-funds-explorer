import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { COMPANY_INFO } from '@/config/company';
import { getSitewideSchemas } from '../schemas/sitewideSchemas';
import { BREADCRUMB_CONFIGS } from '../schemas/breadcrumbSchema';

export function getHomeSeo(funds?: Fund[]): SEOData {
  const fundCount = funds?.length || 40;
  
  return {
    title: 'Compare 32+ Portugal Golden Visa Funds (2025) | Movingto',
    keywords: [
      'Portugal Golden Visa funds',
      'CMVM funds',
      'Golden Visa investment funds',
      'Portugal investment funds',
      'compare Golden Visa funds',
      'CMVM regulated funds',
      'investment immigration Portugal'
    ],
    description: 'Browse vetted Portugal Golden Visa investment funds. Compare returns, minimums, and terms. Find the right fund for your €500k residence by investment application.',
    url: URL_CONFIG.buildUrl('/'),
    canonical: URL_CONFIG.buildUrl('/'),
    structuredData: getHomepageStructuredData(funds)
  };
}

function getHomepageStructuredData(funds?: Fund[]): any[] {
  const topFunds = funds ? funds.filter((f: any) => f && f.name && f.id).slice(0, 10) : [];
  
  return [
    // Include sitewide schemas
    ...getSitewideSchemas(),
    // Homepage breadcrumb (single item)
    BREADCRUMB_CONFIGS.homepage(),
    // Top funds list
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Top Portugal Golden Visa Investment Funds',
      'description': 'Featured top-rated Portugal Golden Visa investment funds',
      'numberOfItems': topFunds.length,
      'itemListElement': topFunds.map((fund: any, index: number) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'FinancialProduct',
          'name': fund.name,
          'url': URL_CONFIG.buildFundUrl(fund.id),
          'category': fund.category,
          'offers': {
            '@type': 'Offer',
            'price': fund.minimumInvestment || 0,
            'priceCurrency': 'EUR'
          }
        }
      }))
    }
  ];
}
