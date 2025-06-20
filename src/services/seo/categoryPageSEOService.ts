
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class CategoryPageSEOService extends BaseSEOService {
  static getCategoryPageSEO(categoryName: string): SEOData {
    console.log('🔥 CategoryPageSEOService: Generating SEO for category:', categoryName);
    
    // Enhanced validation and debugging for category name
    if (!categoryName || categoryName.trim() === '' || categoryName === 'undefined' || categoryName === 'null') {
      console.warn('🔥 CategoryPageSEOService: Invalid category name provided:', categoryName, 'using fallback');
      categoryName = 'Investment Funds';
    }
    
    const cleanCategoryName = categoryName.trim();
    
    // Add more detailed logging
    console.log('🔥 CategoryPageSEOService: Processing category:', {
      original: categoryName,
      cleaned: cleanCategoryName,
      isEmpty: cleanCategoryName === '',
      length: cleanCategoryName.length
    });
    
    const title = `Top ${cleanCategoryName} Golden Visa Funds | Fund Categories | Movingto`;
    const contextualBaseUrl = this.getContextualBaseUrl();
    
    console.log('🔥 CategoryPageSEOService: Generated SEO data:', {
      title,
      categoryName: cleanCategoryName,
      url: `${contextualBaseUrl}/categories/${this.slugify(cleanCategoryName)}`
    });
    
    const seoData = {
      title: title,
      description: `Discover ${cleanCategoryName} Golden Visa funds. Browse and compare funds to find the best Golden Visa investment for you.`,
      url: `${contextualBaseUrl}/categories/${this.slugify(cleanCategoryName)}`,
      structuredData: this.createCollectionPageSchema(
        `${cleanCategoryName} Golden Visa Investment Funds`,
        `Collection of ${cleanCategoryName} Golden Visa investment funds`
      )
    };
    
    console.log('🔥 CategoryPageSEOService: Final SEO data for category page:', seoData);
    return seoData;
  }

  static getTagPageSEO(tagName: string): SEOData {
    console.log('🔥 CategoryPageSEOService: Generating SEO for tag:', tagName);
    
    // Enhanced validation and debugging for tag name
    if (!tagName || tagName.trim() === '' || tagName === 'undefined' || tagName === 'null') {
      console.warn('🔥 CategoryPageSEOService: Invalid tag name provided:', tagName, 'using fallback');
      tagName = 'Investment';
    }
    
    const cleanTagName = tagName.trim();
    
    // Add more detailed logging
    console.log('🔥 CategoryPageSEOService: Processing tag:', {
      original: tagName,
      cleaned: cleanTagName,
      isEmpty: cleanTagName === '',
      length: cleanTagName.length
    });
    
    const title = `${cleanTagName} Golden Visa Funds | Fund Tags | Movingto`;
    const contextualBaseUrl = this.getContextualBaseUrl();
    
    console.log('🔥 CategoryPageSEOService: Generated SEO data:', {
      title,
      tagName: cleanTagName,
      url: `${contextualBaseUrl}/tags/${this.slugify(cleanTagName)}`
    });
    
    const seoData = {
      title: title,
      description: `Discover ${cleanTagName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`,
      url: `${contextualBaseUrl}/tags/${this.slugify(cleanTagName)}`,
      structuredData: this.createCollectionPageSchema(
        `${cleanTagName} Golden Visa Investment Funds`,
        `Collection of ${cleanTagName} Golden Visa investment funds`
      )
    };
    
    console.log('🔥 CategoryPageSEOService: Final SEO data for tag page:', seoData);
    return seoData;
  }

  static getCategoriesHubSEO(): SEOData {
    const contextualBaseUrl = this.getContextualBaseUrl();
    return {
      title: 'Fund Categories | Portugal Golden Visa Investment Funds',
      description: 'Explore different categories of Portugal Golden Visa investment funds.',
      url: `${contextualBaseUrl}/categories`,
      structuredData: {}
    };
  }

  static getTagsHubSEO(): SEOData {
    const contextualBaseUrl = this.getContextualBaseUrl();
    return {
      title: 'Fund Tags | Portugal Golden Visa Investment Funds',
      description: 'Browse funds by tags to find the perfect Portugal Golden Visa investment.',
      url: `${contextualBaseUrl}/tags`,
      structuredData: {}
    };
  }
}
