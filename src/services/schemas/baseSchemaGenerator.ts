
import { StructuredDataSchema } from '../structuredDataService';
import { URL_CONFIG } from '../../utils/urlConfig';

export class BaseSchemaGenerator {
  
  // Generate WebSite schema
  static generateWebSiteSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto',
      'url': URL_CONFIG.BASE_URL,
      'description': 'Find and compare the best Golden Visa investment funds in Portugal',
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${URL_CONFIG.BASE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  // Generate Organization schema for Movingto
  static generateMovingtoOrganizationSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Movingto',
      'url': URL_CONFIG.BASE_URL,
      'logo': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg',
      'description': 'Leading platform for Golden Visa investment fund comparison and research',
      'founder': {
        '@type': 'Person',
        'name': 'Dean Fankhauser'
      },
      'knowsAbout': ['Golden Visa', 'Portugal Investment', 'Investment Funds', 'Fund Managers'],
      'serviceArea': {
        '@type': 'Place',
        'name': 'Worldwide'
      }
    };
  }
}
