
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class FundIndexSEOService extends BaseSEOService {
  static getFundIndexSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    const url = `${baseUrl}/funds/index`;
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': '2025 Golden Visa Fund Index - Portugal Investment Rankings',
      'description': 'The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. Compare performance, fees, and regulation scores.',
      'url': url,
      'mainEntity': {
        '@type': 'ItemList',
        'name': '2025 Golden Visa Fund Index',
        'description': 'Comprehensive ranking of Portugal Golden Visa investment funds',
        'numberOfItems': 11,
        'itemListOrder': 'Descending',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Top Ranked Golden Visa Funds',
            'description': 'The highest scoring Golden Visa investment funds based on performance, regulation, fees, and investor protection'
          }
        ]
      },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': baseUrl
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Fund Index',
            'item': url
          }
        ]
      },
      'author': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com'
      },
      'datePublished': '2025-01-01',
      'dateModified': new Date().toISOString().split('T')[0],
      'keywords': 'Golden Visa, Portugal investment funds, fund ranking, investment index, Golden Visa funds 2025'
    };

    return {
      title: '2025 Golden Visa Fund Index | Portugal Investment Rankings',
      description: 'The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. Compare performance, fees, and regulation scores with our comprehensive index.',
      url,
      keywords: [
        'Golden Visa Fund Index',
        'Portugal investment ranking',
        'Golden Visa funds 2025',
        'investment fund comparison',
        'Portugal fund performance',
        'Golden Visa fund ratings',
        'investment fund analysis',
        'Portugal fund index'
      ],
      structuredData
    };
  }
}
