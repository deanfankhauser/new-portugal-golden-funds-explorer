
export class MetaTagManager {
  
  // List of all meta tags that should be managed by page SEO components
  private static readonly MANAGED_META_SELECTORS = [
    'title',
    'meta[name="description"]',
    'meta[name="keywords"]', 
    'meta[name="robots"]',
    'meta[name="author"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:type"]',
    'meta[property="og:url"]',
    'meta[property="og:site_name"]',
    'meta[property="og:image"]',
    'meta[property="og:image:width"]',
    'meta[property="og:image:height"]',
    'meta[property="og:image:alt"]',
    'meta[property="og:locale"]',
    'meta[name="twitter:card"]',
    'meta[name="twitter:site"]',
    'meta[name="twitter:creator"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="twitter:image"]',
    'meta[name="twitter:image:alt"]',
    'link[rel="canonical"]'
  ];

  // Clear all managed meta tags including title
  static clearAllManagedMetaTags(): void {
    console.log('MetaTagManager: Clearing all managed meta tags');
    this.MANAGED_META_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
  }

  // Helper function to create and append meta tags
  static createMetaTag(attributes: Record<string, string>): void {
    const meta = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
      meta.setAttribute(key, value);
    });
    document.head.appendChild(meta);
  }

  // Helper function to create link tags (for canonical)
  static createLinkTag(attributes: Record<string, string>): void {
    const link = document.createElement('link');
    Object.entries(attributes).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });
    document.head.appendChild(link);
  }

  // Set page title
  static setPageTitle(title: string): void {
    console.log('MetaTagManager: Setting page title:', title);
    document.title = title;
  }

  // Simplified meta tag setup using hardcoded data
  static setupPageMetaTags(metaData: {
    title: string;
    description: string;
    keywords: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogUrl: string;
    twitterTitle: string;
    twitterDescription: string;
    imageUrl?: string;
    imageAlt?: string;
  }): void {
    console.log('MetaTagManager: Setting up meta tags for:', metaData.title);
    
    // Set page title
    this.setPageTitle(metaData.title);
    
    // Create all meta tags
    this.createMetaTag({ name: 'description', content: metaData.description });
    this.createMetaTag({ name: 'keywords', content: metaData.keywords });
    this.createMetaTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
    this.createMetaTag({ name: 'author', content: 'Dean Fankhauser, CEO' });

    // Open Graph meta tags
    this.createMetaTag({ property: 'og:title', content: metaData.ogTitle });
    this.createMetaTag({ property: 'og:description', content: metaData.ogDescription });
    this.createMetaTag({ property: 'og:type', content: 'website' });
    this.createMetaTag({ property: 'og:url', content: metaData.ogUrl });
    this.createMetaTag({ property: 'og:site_name', content: 'Movingto Portugal Golden Visa Funds' });
    this.createMetaTag({ property: 'og:locale', content: 'en_US' });

    // Image meta tags
    const imageUrl = metaData.imageUrl || 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg';
    const imageAlt = metaData.imageAlt || 'Portugal Golden Visa Investment Funds';
    
    this.createMetaTag({ property: 'og:image', content: imageUrl });
    this.createMetaTag({ property: 'og:image:width', content: '400' });
    this.createMetaTag({ property: 'og:image:height', content: '400' });
    this.createMetaTag({ property: 'og:image:alt', content: imageAlt });

    // Twitter Card meta tags
    this.createMetaTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.createMetaTag({ name: 'twitter:site', content: '@movingtoio' });
    this.createMetaTag({ name: 'twitter:creator', content: '@movingtoio' });
    this.createMetaTag({ name: 'twitter:title', content: metaData.twitterTitle });
    this.createMetaTag({ name: 'twitter:description', content: metaData.twitterDescription });
    this.createMetaTag({ name: 'twitter:image', content: imageUrl });
    this.createMetaTag({ name: 'twitter:image:alt', content: imageAlt });

    // Add canonical URL
    this.createLinkTag({ rel: 'canonical', href: metaData.canonicalUrl });

    console.log('MetaTagManager: Meta tags setup complete');
  }
}
