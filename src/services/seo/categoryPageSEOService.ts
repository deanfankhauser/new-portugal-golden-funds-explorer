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
    console.log('CategoryPageSEOService: Generating SEO for tag:', tagName);
    
    // Ensure we have a valid tag name
    if (!tagName || tagName.trim() === '') {
      console.warn('CategoryPageSEOService: Empty tag name provided, using fallback');
      tagName = 'Investment';
    }
    
    const cleanTagName = tagName.trim();
    const title = `${cleanTagName} Golden Visa Funds | Movingto`;
    
    console.log('CategoryPageSEOService: Clean tag name:', cleanTagName);
    console.log('CategoryPageSEOService: Generated title:', title);
    
    const seoData = {
      title: title,
      description: `Discover ${cleanTagName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`,
      url: `${this.baseUrl}/tags/${this.slugify(cleanTagName)}`,
      structuredData: this.createCollectionPageSchema(
        `${cleanTagName} Golden Visa Investment Funds`,
        `Collection of ${cleanTagName} Golden Visa investment funds`
      )
    };
    
    console.log('CategoryPageSEOService: Final SEO data:', seoData);
    return seoData;
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
