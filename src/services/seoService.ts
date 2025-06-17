export class SEOService {
  
  // Add canonical URL to prevent duplicate content
  static setCanonicalUrl(url: string): void {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    document.head.appendChild(canonical);
  }

  // Add preload directives for critical resources
  static addPreloadDirectives(): void {
    const criticalResources = [
      { href: '/src/index.css', as: 'style' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
    ];

    criticalResources.forEach(resource => {
      const existingPreload = document.querySelector(`link[href="${resource.href}"]`);
      if (!existingPreload) {
        const preload = document.createElement('link');
        preload.rel = 'preload';
        preload.href = resource.href;
        preload.as = resource.as;
        if (resource.as === 'style') {
          preload.onload = () => {
            preload.rel = 'stylesheet';
          };
        }
        document.head.appendChild(preload);
      }
    });
  }

  // Add security headers via meta tags (removed problematic X-Frame-Options)
  static addSecurityHeaders(): void {
    const securityMetas = [
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
      { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'referrer', content: 'strict-origin-when-cross-origin' }
    ];

    securityMetas.forEach(meta => {
      const identifier = meta['http-equiv'] || meta.name;
      const existing = document.querySelector(`meta[${meta['http-equiv'] ? 'http-equiv' : 'name'}="${identifier}"]`);
      if (!existing) {
        const metaElement = document.createElement('meta');
        if (meta['http-equiv']) {
          metaElement.setAttribute('http-equiv', meta['http-equiv']);
        } else {
          metaElement.setAttribute('name', meta.name);
        }
        metaElement.content = meta.content;
        document.head.appendChild(metaElement);
      }
    });
  }

  // Optimize meta descriptions with better keywords (limit to 155 characters)
  static optimizeMetaDescription(description: string, keywords: string[] = []): string {
    if (description.length > 155) {
      return description.substring(0, 155);
    }
    const keywordString = keywords.length > 0 ? ` | ${keywords.join(', ')}` : '';
    const fullDescription = `${description}${keywordString}`;
    return fullDescription.substring(0, 155);
  }

  // Initialize all SEO enhancements (removed redundant hreflang function)
  static initializeSEO(currentUrl: string): void {
    this.setCanonicalUrl(currentUrl);
    this.addPreloadDirectives();
    this.addSecurityHeaders();
  }
}
