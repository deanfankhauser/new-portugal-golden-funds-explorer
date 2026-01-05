import { SEOData } from '../types';
import { URL_CONFIG } from '@/utils/urlConfig';
import { SEO_CONFIG } from '@/config/company';

export function getFundsSeo(): SEOData {
  const currentYear = SEO_CONFIG.currentYear;
  
  return {
    title: `Portugal Golden Visa Funds Directory | Compare & Filter (${currentYear})`,
    description: `Browse and compare ${currentYear} Portugal Golden Visa investment funds. Filter by minimum investment, risk level, liquidity, and verification status. Find the right fund for your residency goals.`,
    url: URL_CONFIG.buildUrl('/funds'),
    canonical: URL_CONFIG.buildUrl('/funds'),
    robots: 'index, follow',
    keywords: [
      'portugal golden visa funds',
      'golden visa fund directory',
      'compare investment funds',
      'portugal residency investment',
      'golden visa fund comparison',
      'investment fund filter',
      'verified golden visa funds'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Portugal Golden Visa Funds Directory (${currentYear})`,
      description: `Comprehensive directory of Portugal Golden Visa investment funds with filtering and comparison tools.`,
      url: URL_CONFIG.buildUrl('/funds'),
      mainEntity: {
        '@type': 'ItemList',
        name: 'Golden Visa Investment Funds',
        description: 'Filterable list of Portugal Golden Visa eligible investment funds'
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: URL_CONFIG.BASE_URL
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Funds',
            item: URL_CONFIG.buildUrl('/funds')
          }
        ]
      }
    }
  };
}
