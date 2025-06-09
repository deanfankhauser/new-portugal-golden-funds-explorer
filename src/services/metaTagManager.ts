
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
    'link[rel="canonical"]',
    // Add more selectors to catch any remaining meta tags
    'meta[property^="og:"]',
    'meta[name^="twitter:"]'
  ];

  // Clear all managed meta tags including title
  static clearAllManagedMetaTags(): void {
    console.log('MetaTagManager: Clearing all managed meta tags');
    
    // Clear title first
    document.title = '';
    
    // Clear all meta and link tags
    this.MANAGED_META_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        console.log('MetaTagManager: Removing element:', el.outerHTML);
        el.remove();
      });
    });

    // Also remove any React Helmet managed tags
    const helmetTags = document.querySelectorAll('[data-react-helmet]');
    helmetTags.forEach(el => {
      console.log('MetaTagManager: Removing React Helmet tag:', el.outerHTML);
      el.remove();
    });

    // Force a small delay to ensure DOM updates
    setTimeout(() => {
      console.log('MetaTagManager: Final cleanup check');
      // Double-check and remove any remaining problematic tags
      const remainingMeta = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"], meta[name="keywords"]');
      remainingMeta.forEach(el => {
        console.log('MetaTagManager: Removing remaining tag:', el.outerHTML);
        el.remove();
      });
    }, 50);
  }

  // Helper function to create and append meta tags
  static createMetaTag(attributes: Record<string, string>): void {
    const meta = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
      meta.setAttribute(key, value);
    });
    document.head.appendChild(meta);
    console.log('MetaTagManager: Created meta tag:', meta.outerHTML);
  }

  // Helper function to create link tags (for canonical)
  static createLinkTag(attributes: Record<string, string>): void {
    const link = document.createElement('link');
    Object.entries(attributes).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });
    document.head.appendChild(link);
    console.log('MetaTagManager: Created link tag:', link.outerHTML);
  }

  // Set page title
  static setPageTitle(title: string): void {
    console.log('MetaTagManager: Setting page title:', title);
    document.title = title;
    
    // Also ensure no title tag exists in head
    const existingTitleTags = document.querySelectorAll('head > title');
    existingTitleTags.forEach((el, index) => {
      if (index > 0) { // Keep only the first title tag
        el.remove();
      }
    });
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
    
    // Set page title first
    this.setPageTitle(metaData.title);
    
    // Create all meta tags with explicit logging
    console.log('MetaTagManager: Creating description meta tag');
    this.createMetaTag({ name: 'description', content: metaData.description });
    
    console.log('MetaTagManager: Creating keywords meta tag');
    this.createMetaTag({ name: 'keywords', content: metaData.keywords });
    
    this.createMetaTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
    this.createMetaTag({ name: 'author', content: 'Dean Fankhauser, CEO' });

    // Open Graph meta tags
    console.log('MetaTagManager: Creating Open Graph meta tags');
    this.createMetaTag({ property: 'og:title', content: metaData.ogTitle });
    this.createMetaTag({ property: 'og:description', content: metaData.ogDescription });
    this.createMetaTag({ property: 'og:type', content: 'website' });
    this.createMetaTag({ property: 'og:url', content: metaData.ogUrl });
    this.createMetaTag({ property: 'og:site_name', content: 'Movingto Portugal Golden Visa Funds' });
    this.createMetaTag({ property: 'og:locale', content: 'en_US' });

    // Image meta tags
    const imageUrl = metaData.imageUrl || 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg';
    const imageAlt = metaData.imageAlt || 'Portugal Golden Visa Investment Funds';
    
    console.log('MetaTagManager: Creating image meta tags');
    this.createMetaTag({ property: 'og:image', content: imageUrl });
    this.createMetaTag({ property: 'og:image:width', content: '400' });
    this.createMetaTag({ property: 'og:image:height', content: '400' });
    this.createMetaTag({ property: 'og:image:alt', content: imageAlt });

    // Twitter Card meta tags
    console.log('MetaTagManager: Creating Twitter meta tags');
    this.createMetaTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.createMetaTag({ name: 'twitter:site', content: '@movingtoio' });
    this.createMetaTag({ name: 'twitter:creator', content: '@movingtoio' });
    this.createMetaTag({ name: 'twitter:title', content: metaData.twitterTitle });
    this.createMetaTag({ name: 'twitter:description', content: metaData.twitterDescription });
    this.createMetaTag({ name: 'twitter:image', content: imageUrl });
    this.createMetaTag({ name: 'twitter:image:alt', content: imageAlt });

    // Add canonical URL
    console.log('MetaTagManager: Creating canonical link');
    this.createLinkTag({ rel: 'canonical', href: metaData.canonicalUrl });

    console.log('MetaTagManager: Meta tags setup complete');
    
    // Verify tags were actually created
    setTimeout(() => {
      const description = document.querySelector('meta[name="description"]');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      console.log('MetaTagManager: Verification - Description tag:', description?.getAttribute('content'));
      console.log('MetaTagManager: Verification - OG Title tag:', ogTitle?.getAttribute('content'));
      console.log('MetaTagManager: Verification - Page title:', document.title);
    }, 100);
  }
}
