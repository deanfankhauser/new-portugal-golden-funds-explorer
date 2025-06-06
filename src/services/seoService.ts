
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

  // Add security headers via meta tags
  static addSecurityHeaders(): void {
    const securityMetas = [
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
      { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
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

  // Optimize meta descriptions with better keywords
  static optimizeMetaDescription(description: string, keywords: string[] = []): string {
    const keywordString = keywords.length > 0 ? ` | ${keywords.join(', ')}` : '';
    return `${description}${keywordString}`.substring(0, 160);
  }

  // Add hreflang tags for international SEO (fixed to remove non-existent Portuguese route)
  static addHreflangTags(currentUrl: string): void {
    const languages = [
      { lang: 'en', href: currentUrl },
      { lang: 'x-default', href: currentUrl }
    ];

    // Remove existing hreflang tags
    document.querySelectorAll('link[hreflang]').forEach(link => link.remove());

    languages.forEach(({ lang, href }) => {
      const hreflang = document.createElement('link');
      hreflang.rel = 'alternate';
      hreflang.hreflang = lang;
      hreflang.href = href;
      document.head.appendChild(hreflang);
    });
  }

  // Initialize all SEO enhancements
  static initializeSEO(currentUrl: string): void {
    this.setCanonicalUrl(currentUrl);
    this.addPreloadDirectives();
    this.addSecurityHeaders();
    this.addHreflangTags(currentUrl);
  }
}
