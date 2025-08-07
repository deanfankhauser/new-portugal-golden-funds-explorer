import { URL_CONFIG } from '../utils/urlConfig';

export interface SEOConfig {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  breadcrumbs?: Array<{name: string, url: string}>;
  type?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export class OptimizedSEOService {
  private static readonly DEFAULT_IMAGE = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
  private static readonly MAX_TITLE_LENGTH = 60;
  private static readonly MAX_DESCRIPTION_LENGTH = 155;

  // Clean up duplicate meta tags and ensure single viewport
  static cleanupDuplicateMetaTags(): void {
    // Remove duplicate viewports (keep only one)
    const viewports = document.querySelectorAll('meta[name="viewport"]');
    if (viewports.length > 1) {
      for (let i = 1; i < viewports.length; i++) {
        viewports[i].remove();
      }
    }

    // Remove duplicate descriptions
    const descriptions = document.querySelectorAll('meta[name="description"]');
    if (descriptions.length > 1) {
      for (let i = 1; i < descriptions.length; i++) {
        descriptions[i].remove();
      }
    }

    // Remove duplicate canonicals
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    if (canonicals.length > 1) {
      for (let i = 1; i < canonicals.length; i++) {
        canonicals[i].remove();
      }
    }
  }

  // Normalize and validate URLs
  static normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      urlObj.protocol = 'https:';
      
      // Remove trailing slash unless it's root
      if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
        urlObj.pathname = urlObj.pathname.slice(0, -1);
      }
      
      // Remove default ports
      if (urlObj.port === '443' || urlObj.port === '80') {
        urlObj.port = '';
      }
      
      return urlObj.toString();
    } catch (error) {
      console.warn('URL normalization failed:', error);
      return url;
    }
  }

  // Optimize title length and keywords
  static optimizeTitle(title: string): string {
    if (title.length <= this.MAX_TITLE_LENGTH) {
      return title;
    }
    
    // Truncate at word boundary
    const truncated = title.substring(0, this.MAX_TITLE_LENGTH);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > this.MAX_TITLE_LENGTH * 0.8 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  // Optimize meta description with keywords
  static optimizeDescription(description: string, keywords: string[] = []): string {
    let cleanDescription = description
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[^\w\s\-\.\,\!\?]/g, '');
    
    // Add keywords naturally if space allows
    if (keywords.length > 0 && cleanDescription.length < 120) {
      const keywordPhrase = keywords.slice(0, 2).join(', ');
      cleanDescription = `${cleanDescription} | ${keywordPhrase}`;
    }
    
    // Ensure proper length
    if (cleanDescription.length > this.MAX_DESCRIPTION_LENGTH) {
      const truncated = cleanDescription.substring(0, this.MAX_DESCRIPTION_LENGTH - 3);
      const lastSpace = truncated.lastIndexOf(' ');
      return lastSpace > this.MAX_DESCRIPTION_LENGTH * 0.8 
        ? truncated.substring(0, lastSpace) + '...'
        : truncated + '...';
    }
    
    return cleanDescription;
  }

  // Set canonical URL with validation
  static setCanonicalUrl(url: string): void {
    const normalizedUrl = this.normalizeUrl(url);
    
    // Remove existing canonical
    document.querySelector('link[rel="canonical"]')?.remove();

    // Add new canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = normalizedUrl;
    document.head.appendChild(canonical);
  }

  // Add critical resource hints
  static addResourceHints(): void {
    const hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'dns-prefetch', href: 'https://pbs.twimg.com' }
    ];

    hints.forEach(hint => {
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) {
          link.setAttribute('crossorigin', 'anonymous');
        }
        document.head.appendChild(link);
      }
    });
  }

  // Enhanced OpenGraph with validation
  static setOpenGraph(config: SEOConfig): void {
    const ogTags = [
      { property: 'og:title', content: this.optimizeTitle(config.title) },
      { property: 'og:description', content: this.optimizeDescription(config.description, config.keywords) },
      { property: 'og:url', content: this.normalizeUrl(config.url) },
      { property: 'og:type', content: config.type || 'website' },
      { property: 'og:image', content: config.image || this.DEFAULT_IMAGE },
      { property: 'og:image:width', content: '400' },
      { property: 'og:image:height', content: '400' },
      { property: 'og:image:alt', content: `${config.title} - Movingto` },
      { property: 'og:site_name', content: 'Movingto' },
      { property: 'og:locale', content: 'en_US' },
    ];

    // Add article-specific tags if provided
    if (config.publishedTime) {
      ogTags.push({ property: 'article:published_time', content: config.publishedTime });
    }
    if (config.modifiedTime) {
      ogTags.push({ property: 'article:modified_time', content: config.modifiedTime });
    }
    if (config.author) {
      ogTags.push({ property: 'article:author', content: config.author });
    }

    // Remove existing OG tags
    document.querySelectorAll('meta[property^="og:"], meta[property^="article:"]').forEach(tag => tag.remove());

    // Add new OG tags
    ogTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  // Enhanced Twitter Cards
  static setTwitterCard(config: SEOConfig): void {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@movingtoio' },
      { name: 'twitter:creator', content: '@movingtoio' },
      { name: 'twitter:title', content: this.optimizeTitle(config.title) },
      { name: 'twitter:description', content: this.optimizeDescription(config.description, config.keywords) },
      { name: 'twitter:image', content: config.image || this.DEFAULT_IMAGE },
      { name: 'twitter:image:alt', content: `${config.title} - Movingto` }
    ];

    // Remove existing Twitter tags
    document.querySelectorAll('meta[name^="twitter:"]').forEach(tag => tag.remove());

    // Add new Twitter tags
    twitterTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  // Add breadcrumb structured data (single implementation)
  static addBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>): void {
    // Remove existing breadcrumb structured data
    document.querySelectorAll('script[type="application/ld+json"][data-schema="breadcrumb"]').forEach(script => script.remove());

    if (breadcrumbs.length === 0) return;

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': this.normalizeUrl(item.url)
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'breadcrumb');
    script.textContent = JSON.stringify(breadcrumbSchema, null, 2);
    document.head.appendChild(script);
  }

  // Enhanced robots meta with granular control
  static setRobotsMeta(directives: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
  } = {}): void {
    const robotsDirectives: string[] = [];
    
    robotsDirectives.push(directives.index !== false ? 'index' : 'noindex');
    robotsDirectives.push(directives.follow !== false ? 'follow' : 'nofollow');
    
    if (directives.noarchive) robotsDirectives.push('noarchive');
    if (directives.nosnippet) robotsDirectives.push('nosnippet');
    if (directives.maxSnippet) robotsDirectives.push(`max-snippet:${directives.maxSnippet}`);
    if (directives.maxImagePreview) robotsDirectives.push(`max-image-preview:${directives.maxImagePreview}`);

    // Remove existing robots meta
    document.querySelector('meta[name="robots"]')?.remove();
    
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = robotsDirectives.join(', ');
    document.head.appendChild(robotsMeta);
  }

  // Enhanced lazy loading with WebP support
  static initializeLazyLoading(): void {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Handle WebP with fallback
          if (img.dataset.src) {
            const originalSrc = img.dataset.src;
            
            // Check WebP support and use if available
            if (this.supportsWebP() && !originalSrc.includes('.webp')) {
              const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
              
              // Test if WebP version exists
              const testImg = new Image();
              testImg.onload = () => {
                img.src = webpSrc;
                img.removeAttribute('data-src');
              };
              testImg.onerror = () => {
                img.src = originalSrc;
                img.removeAttribute('data-src');
              };
              testImg.src = webpSrc;
            } else {
              img.src = originalSrc;
              img.removeAttribute('data-src');
            }
          }
          
          // Handle srcset
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          img.classList.add('loaded');
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src], img.lazy').forEach(img => {
      imageObserver.observe(img);
    });

    // Store observer for cleanup
    (window as any).__lazyImageObserver = imageObserver;
  }

  // Check WebP support
  private static supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  }

  // Comprehensive SEO initialization
  static initializeOptimizedSEO(config: SEOConfig): void {
    console.log('🚀 Initializing Optimized SEO for:', config.url);
    
    // Phase 1: Clean up and fix critical issues
    this.cleanupDuplicateMetaTags();
    this.setCanonicalUrl(config.url);
    
    // Set basic meta tags
    document.title = this.optimizeTitle(config.title);
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const optimizedDescription = this.optimizeDescription(config.description, config.keywords);
    if (metaDescription) {
      metaDescription.setAttribute('content', optimizedDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = optimizedDescription;
      document.head.appendChild(meta);
    }

    // Phase 2: Enhanced SEO elements
    this.setRobotsMeta({
      index: true,
      follow: true,
      maxImagePreview: 'large',
      maxSnippet: 160
    });
    
    this.setOpenGraph(config);
    this.setTwitterCard(config);
    
    // Add breadcrumb structured data if provided
    if (config.breadcrumbs && config.breadcrumbs.length > 0) {
      this.addBreadcrumbStructuredData(config.breadcrumbs);
    }
    
    // Phase 3: Performance and resource optimization
    this.addResourceHints();
    this.initializeLazyLoading();
    
    console.log('✅ Optimized SEO initialization complete');
  }
}
