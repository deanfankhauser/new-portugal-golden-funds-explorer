
export class BaseSEOService {
  protected static readonly baseUrl = 'https://movingto.com/funds';
  
  protected static createBaseStructuredData() {
    return {
      '@context': 'https://schema.org'
    };
  }

  protected static createOrganizationSchema() {
    return {
      '@type': 'Organization',
      'name': 'Movingto',
      'url': this.baseUrl
    };
  }

  protected static createWebSiteSchema() {
    return {
      ...this.createBaseStructuredData(),
      '@type': 'WebSite',
      'name': 'Movingto Portugal Golden Visa Funds',
      'url': this.baseUrl,
      'description': 'Find and compare the best Golden Visa investment funds in Portugal',
      'publisher': this.createOrganizationSchema()
    };
  }

  protected static createCollectionPageSchema(name: string, description: string) {
    return {
      ...this.createBaseStructuredData(),
      '@type': 'CollectionPage',
      'name': name,
      'description': description
    };
  }

  protected static slugify(text: string): string {
    return text?.toLowerCase().replace(/\s+/g, '-') || '';
  }
}
