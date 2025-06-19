

import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class CategoryPageSEOService extends BaseSEOService {
  static getCategoryPageSEO(categoryName: string): SEOData {
    return {
      title: `Top ${categoryName} Golden Visa Funds | Fund Categories | Movingto`,
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
    
    // Enhanced validation and debugging for tag name
    if (!tagName || tagName.trim() === '' || tagName === 'undefined' || tagName === 'null') {
      console.warn('CategoryPageSEOService: Invalid tag name provided:', tagName, 'using fallback');
      tagName = 'Investment';
    }
    
    const cleanTagName = tagName.trim();
    
    // Add more detailed logging
    console.log('CategoryPageSEOService: Processing tag:', {
      original: tagName,
      cleaned: cleanTagName,
      isEmpty: cleanTagName === '',
      length: cleanTagName.length
    });
    
    const title = `${cleanTagName} Golden Visa Funds | Fund Tags | Movingto`;
    
    console.log('CategoryPageSEOService: Generated SEO data:', {
      title,
      tagName: cleanTagName,
      url: `${this.baseUrl}/tags/${this.slugify(cleanTagName)}`
    });
    
    const seoData = {
      title: title,
      description: `Discover ${cleanTagName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`,
      url: `${this.baseUrl}/tags/${this.slugify(cleanTagName)}`,
      structuredData: this.createCollectionPageSchema(
        `${cleanTagName} Golden Visa Investment Funds`,
        `Collection of ${cleanTagName} Golden Visa investment funds`
      )
    };
    
    console.log('CategoryPageSEOService: Final SEO data for tag page:', seoData);
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
