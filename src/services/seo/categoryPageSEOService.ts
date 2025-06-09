
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class CategoryPageSEOService extends BaseSEOService {
  static getCategoryPageSEO(categoryName: string): SEOData {
    return {
      title: `Top ${categoryName} Golden Visa Funds | Movingto`,
      description: `Discover ${categoryName} Golden Visa funds. Browse and compare funds to find the best Golden Visa investment for you.`,
      url: `${this.baseUrl}/categories/${this.slugify(categoryName)}`,
      structuredData: this.createCollectionPageSchema(
        `${categoryName} Golden Visa Investment Funds`,
        `Collection of ${categoryName} Golden Visa investment funds`
      )
    };
  }

  static getTagPageSEO(tagName: string): SEOData {
    return {
      title: `Top ${tagName} Golden Visa Funds | Movingto`,
      description: `Discover ${tagName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`,
      url: `${this.baseUrl}/tags/${this.slugify(tagName)}`,
      structuredData: this.createCollectionPageSchema(
        `${tagName} Golden Visa Investment Funds`,
        `Collection of ${tagName} Golden Visa investment funds`
      )
    };
  }

  static getCategoriesHubSEO(): SEOData {
    return {
      title: 'Fund Categories | Portugal Golden Visa Investment Funds',
      description: 'Explore different categories of Portugal Golden Visa investment funds.',
      url: `${this.baseUrl}/categories`,
      structuredData: {}
    };
  }

  static getTagsHubSEO(): SEOData {
    return {
      title: 'Fund Tags | Portugal Golden Visa Investment Funds',
      description: 'Browse funds by tags to find the perfect Portugal Golden Visa investment.',
      url: `${this.baseUrl}/tags`,
      structuredData: {}
    };
  }
}
