
export class BaseSEOService {
  protected static baseUrl = 'https://movingto.com/funds';

  protected static createBaseStructuredData() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto - Portugal Golden Visa Investment Funds',
      'url': this.baseUrl
    };
  }

  protected static createWebSiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto',
      'url': this.baseUrl,
      'description': 'Portugal Golden Visa Investment Funds Directory',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${this.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  protected static createCollectionPageSchema(name: string, description: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': name,
      'description': description,
      'url': this.baseUrl
    };
  }

  protected static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  }

  // New method to detect if we're running under a proxy
  protected static detectProxyContext(): { isProxied: boolean; actualPath: string; basePath: string } {
    if (typeof window === 'undefined') {
      console.log('BaseSEOService: Running in SSR context');
      return { isProxied: false, actualPath: '/', basePath: '' };
    }

    const currentUrl = window.location.href;
    const pathname = window.location.pathname;
    
    console.log('BaseSEOService: Detecting proxy context:', {
      currentUrl,
      pathname,
      origin: window.location.origin,
      hostname: window.location.hostname
    });

    // Check if we're running under a /funds proxy
    const isProxied = pathname.startsWith('/funds/') || 
                     currentUrl.includes('/funds/') ||
                     window.location.hostname !== 'movingto.com';

    const basePath = isProxied ? '/funds' : '';
    const actualPath = isProxied ? pathname.replace('/funds', '') : pathname;

    console.log('BaseSEOService: Proxy detection result:', {
      isProxied,
      basePath,
      actualPath,
      recommendedBaseUrl: isProxied ? `${window.location.origin}/funds` : this.baseUrl
    });

    return { isProxied, actualPath, basePath };
  }

  // New method to get the correct base URL based on context
  protected static getContextualBaseUrl(): string {
    const { isProxied } = this.detectProxyContext();
    
    if (typeof window !== 'undefined' && isProxied) {
      const contextualUrl = `${window.location.origin}/funds`;
      console.log('BaseSEOService: Using contextual base URL for proxy:', contextualUrl);
      return contextualUrl;
    }

    console.log('BaseSEOService: Using default base URL:', this.baseUrl);
    return this.baseUrl;
  }
}
