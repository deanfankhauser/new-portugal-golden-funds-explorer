import { SEOData } from '../types';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas/sitewideSchemas';
import { BREADCRUMB_CONFIGS } from '../schemas/breadcrumbSchema';

export function getVerifiedFundsSeo(funds?: Fund[]): SEOData {
  return {
    title: 'CMVM-Registered Portugal Golden Visa Funds (2026) | Movingto Funds',
    keywords: [
      'CMVM funds',
      'verified Golden Visa funds',
      'CMVM registered funds',
      'regulated investment funds Portugal',
      'verified investment funds',
      'Portugal Golden Visa funds'
    ],
    description: 'Browse CMVM-registered funds used for the €500k route. See fees, terms, governance signals, and verification notes where available.',
    url: URL_CONFIG.buildUrl('/verified-funds'),
    canonical: URL_CONFIG.buildUrl('/verified-funds'),
    structuredData: getVerifiedFundsStructuredData(funds)
  };
}

function getVerifiedFundsStructuredData(funds?: Fund[]): any[] {
  const verifiedFunds = funds?.filter(f => f.isVerified) || [];
  
  return [
    ...getSitewideSchemas(),
    BREADCRUMB_CONFIGS.verifiedFunds(),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'CMVM-Linked Portugal Golden Visa Funds',
      'description': 'Explore Portugal Golden Visa funds linked to CMVM-authorised managers.',
      'url': URL_CONFIG.buildUrl('/verified-funds'),
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': verifiedFunds.length,
        'itemListElement': verifiedFunds.slice(0, 10).map((fund, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'url': URL_CONFIG.buildFundUrl(fund.id),
            'category': fund.category
          }
        }))
      }
    }
  ];
}
