import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { COMPANY_INFO } from '@/config/company';
import { getSitewideSchemas } from '../schemas/sitewideSchemas';
import { BREADCRUMB_CONFIGS } from '../schemas/breadcrumbSchema';

export function getHomeSeo(funds?: Fund[]): SEOData {
  return {
    title: 'Compare 32+ Portugal Golden Visa Funds (2026)',
    keywords: [
      'compare Portugal Golden Visa funds',
      'Portugal Golden Visa funds',
      'CMVM funds',
      'Golden Visa investment funds',
      'Portugal investment funds',
      'CMVM regulated funds',
      'investment immigration Portugal'
    ],
    description: 'Compare 32+ Portugal Golden Visa funds side-by-side. Filter by fees, risk, lock-up, and strategy to build your shortlist.',
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
