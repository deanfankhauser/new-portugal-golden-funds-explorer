import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { COMPANY_INFO } from '@/config/company';
import { getSitewideSchemas } from '../schemas/sitewideSchemas';
import { BREADCRUMB_CONFIGS } from '../schemas/breadcrumbSchema';

export function getHomeSeo(funds?: Fund[]): SEOData {
  return {
    title: 'Portugal Golden Visa Funds (2026) | Movingto Funds',
    keywords: [
      'Portugal Golden Visa funds',
      'CMVM funds',
      'Golden Visa investment funds',
      'Portugal investment funds',
      'compare Golden Visa funds',
      'CMVM regulated funds',
      'investment immigration Portugal'
    ],
    description: 'Explore Portugal Golden Visa investment funds and key terms in one place. Disclosure-led profiles, filters, and tools to help you shortlist.',
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
