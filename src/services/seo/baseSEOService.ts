
export class BaseSEOService {
  protected static baseUrl = 'https://movingto.com/funds';

  protected static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters like commas, periods
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim()
      .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
  }

  protected static createBaseStructuredData() {
    return {
      '@context': 'https://schema.org',
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/65bf8df2803e405540708b3c_movingto-logo-white.svg'
        }
      }
    };
  }

  protected static createCollectionPageSchema(name: string, description: string) {
    return {
      ...this.createBaseStructuredData(),
      '@type': 'CollectionPage',
      'name': name,
      'description': description,
      'mainEntity': {
        '@type': 'ItemList',
        'name': name,
        'description': description
      }
    };
  }

  protected static createWebSiteSchema() {
    return {
      ...this.createBaseStructuredData(),
      '@type': 'WebSite',
      'name': 'Portugal Golden Visa Investment Funds | Movingto',
      'description': 'Explore our Portugal Golden Visa Investment Funds List for 2025. Find eligible investment funds to secure residency with a €500,000 investment.',
      'url': this.baseUrl,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${this.baseUrl}?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }
}
