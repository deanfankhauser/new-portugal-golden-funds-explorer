
import { URL_CONFIG } from '../../utils/urlConfig';

export class BaseSEOService {
  protected static getContextualBaseUrl(): string {
    // Always use the consistent URL from URL_CONFIG which includes www
    return URL_CONFIG.BASE_URL;
  }

  protected static buildUrl(path: string): string {
    return URL_CONFIG.buildUrl(path);
  }

  protected static buildFundUrl(fundId: string): string {
    return URL_CONFIG.buildFundUrl(fundId);
  }

  protected static buildManagerUrl(managerName: string): string {
    return URL_CONFIG.buildManagerUrl(managerName);
  }

  protected static buildCategoryUrl(categoryName: string): string {
    return URL_CONFIG.buildCategoryUrl(categoryName);
  }

  protected static buildTagUrl(tagName: string): string {
    return URL_CONFIG.buildTagUrl(tagName);
  }

  // Utility methods that were removed but are still needed
  protected static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  protected static createBaseStructuredData() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto - Portugal Golden Visa Investment Funds',
      'url': this.getContextualBaseUrl()
    };
  }

  protected static createCollectionPageSchema(name: string, description: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': name,
      'description': description,
      'url': this.getContextualBaseUrl()
    };
  }
}
