
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class ManagerPageSEOService extends BaseSEOService {
  static getManagerPageSEO(managerName: string): SEOData {
    // Clean the manager name for URL generation
    const cleanSlug = this.slugify(managerName);
    
    return {
      title: `${managerName} Golden Visa Investment Funds | Fund Manager Profile`,
      description: `Discover ${managerName}'s Golden Visa investment funds. Compare funds and investment strategies from this experienced fund manager.`,
      url: `${this.baseUrl}/manager/${cleanSlug}`,
      structuredData: {
        ...this.createBaseStructuredData(),
        '@type': 'Organization',
        'name': managerName,
        'description': `Fund manager specializing in Golden Visa investment funds`,
        'serviceArea': {
          '@type': 'Place',
          'name': 'Portugal'
        }
      }
    };
  }

  static getManagersHubSEO(): SEOData {
    return {
      title: 'Fund Managers | Portugal Golden Visa Investment Funds',
      description: 'Browse fund managers offering Portugal Golden Visa investment opportunities.',
      url: `${this.baseUrl}/managers`,
      structuredData: {}
    };
  }
}
