import { SEOService } from './seoService';
import { PerformanceMonitoringService } from './performanceMonitoringService';

export class EnhancedSEOService extends SEOService {
  
  // Enhanced canonical URL with better validation
  static setEnhancedCanonicalUrl(url: string): void {
    // Normalize URL to ensure consistency
    const normalizedUrl = this.normalizeUrl(url);
    
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = normalizedUrl;
    document.head.appendChild(canonical);
    
    console.log('✅ Enhanced canonical URL set:', normalizedUrl);
  }

  // Normalize URLs for consistency
  private static normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Ensure HTTPS
      urlObj.protocol = 'https:';
      
      // Remove trailing slash unless it's root
      if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
        urlObj.pathname = urlObj.pathname.slice(0, -1);
      }
      
      // Remove default port
      if (urlObj.port === '443' || urlObj.port === '80') {
        urlObj.port = '';
      }
      
      return urlObj.toString();
    } catch (error) {
      console.warn('URL normalization failed:', error);
      return url;
    }
  }

  // Enhanced meta description optimization
  static optimizeEnhancedMetaDescription(description: string, keywords: string[] = []): string {
    const maxLength = 160;
    
    // Clean description
    let cleanDescription = description
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[^\w\s\-\.\,\!\?]/g, '');
    
    // Add keywords naturally if space allows
    if (keywords.length > 0 && cleanDescription.length < 120) {
      const keywordPhrase = keywords.slice(0, 2).join(', ');
      cleanDescription = `${cleanDescription} ${keywordPhrase}`;
    }
    
    // Ensure proper ending
    if (cleanDescription.length > maxLength) {
      cleanDescription = cleanDescription.substring(0, maxLength - 3) + '...';
    }
    
    return cleanDescription;
  }

  // Add breadcrumb structured data
  static addBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>): void {
    // Remove existing breadcrumb structured data
    const existingScript = document.querySelector('script[type="application/ld+json"][data-breadcrumb="true"]');
    if (existingScript) {
      existingScript.remove();
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb', 'true');
    script.textContent = JSON.stringify(breadcrumbSchema, null, 2);
    document.head.appendChild(script);
  }

  // Enhanced OpenGraph with validation
  static setEnhancedOpenGraph(data: {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  }): void {
    const defaultImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
    
    const ogTags = [
      { property: 'og:title', content: data.title.substring(0, 60) },
      { property: 'og:description', content: data.description.substring(0, 160) },
      { property: 'og:url', content: this.normalizeUrl(data.url) },
      { property: 'og:type', content: data.type || 'website' },
      { property: 'og:image', content: data.image || defaultImage },
      { property: 'og:image:width', content: '400' },
      { property: 'og:image:height', content: '400' },
      { property: 'og:image:alt', content: `${data.title} - Movingto` },
      { property: 'og:site_name', content: 'Movingto' },
      { property: 'og:locale', content: 'en_US' },
    ];

    // Add article-specific tags if provided
    if (data.publishedTime) {
      ogTags.push({ property: 'article:published_time', content: data.publishedTime });
    }
    if (data.modifiedTime) {
      ogTags.push({ property: 'article:modified_time', content: data.modifiedTime });
    }
    if (data.author) {
      ogTags.push({ property: 'article:author', content: data.author });
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
  static setEnhancedTwitterCard(data: {
    title: string;
    description: string;
    image?: string;
    creator?: string;
  }): void {
    const defaultImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
    
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@movingtoio' },
      { name: 'twitter:creator', content: data.creator || '@movingtoio' },
      { name: 'twitter:title', content: data.title.substring(0, 70) },
      { name: 'twitter:description', content: data.description.substring(0, 200) },
      { name: 'twitter:image', content: data.image || defaultImage },
      { name: 'twitter:image:alt', content: `${data.title} - Movingto` }
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

  // Add enhanced robots meta tag
  static setEnhancedRobotsMeta(
    directives: {
      index?: boolean;
      follow?: boolean;
      noarchive?: boolean;
      nosnippet?: boolean;
      maxSnippet?: number;
      maxImagePreview?: 'none' | 'standard' | 'large';
      maxVideoPreview?: number;
    } = {}
  ): void {
    const robotsDirectives: string[] = [];
    
    robotsDirectives.push(directives.index !== false ? 'index' : 'noindex');
    robotsDirectives.push(directives.follow !== false ? 'follow' : 'nofollow');
    
    if (directives.noarchive) robotsDirectives.push('noarchive');
    if (directives.nosnippet) robotsDirectives.push('nosnippet');
    if (directives.maxSnippet) robotsDirectives.push(`max-snippet:${directives.maxSnippet}`);
    if (directives.maxImagePreview) robotsDirectives.push(`max-image-preview:${directives.maxImagePreview}`);
    if (directives.maxVideoPreview) robotsDirectives.push(`max-video-preview:${directives.maxVideoPreview}`);

    const existingRobots = document.querySelector('meta[name="robots"]');
    if (existingRobots) {
      existingRobots.setAttribute('content', robotsDirectives.join(', '));
    } else {
      const robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = robotsDirectives.join(', ');
      document.head.appendChild(robotsMeta);
    }
  }

  // Enhanced lazy loading with intersection observer
  static initializeEnhancedLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // Handle data-src for lazy loading
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Handle data-srcset for responsive images
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Add loaded class for CSS transitions
            img.classList.add('loaded');
            img.classList.remove('lazy');
            
            observer.unobserve(img);
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
  }

  // Add critical resource hints
  static addCriticalResourceHints(): void {
    const resourceHints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
      { rel: 'dns-prefetch', href: 'https://cdn.prod.website-files.com' },
      { rel: 'dns-prefetch', href: 'https://pbs.twimg.com' }
    ];

    resourceHints.forEach(hint => {
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) {
          link.setAttribute('crossorigin', hint.crossorigin);
        }
        document.head.appendChild(link);
      }
    });
  }

  // Comprehensive SEO initialization
  static initializeEnhancedSEO(config: {
    url: string;
    title: string;
    description: string;
    keywords?: string[];
    breadcrumbs?: Array<{name: string, url: string}>;
    type?: string;
    image?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  }): void {
    console.log('🚀 Initializing Enhanced SEO for:', config.url);
    
    // Set enhanced canonical URL
    this.setEnhancedCanonicalUrl(config.url);
    
    // Set enhanced robots meta
    this.setEnhancedRobotsMeta({
      index: true,
      follow: true,
      maxImagePreview: 'large',
      maxSnippet: 160
    });
    
    // Set enhanced OpenGraph
    this.setEnhancedOpenGraph({
      title: config.title,
      description: this.optimizeEnhancedMetaDescription(config.description, config.keywords),
      url: config.url,
      type: config.type,
      image: config.image,
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      author: config.author
    });
    
    // Set enhanced Twitter Card
    this.setEnhancedTwitterCard({
      title: config.title,
      description: config.description,
      image: config.image
    });
    
    // Add breadcrumb structured data if provided
    if (config.breadcrumbs && config.breadcrumbs.length > 0) {
      this.addBreadcrumbStructuredData(config.breadcrumbs);
    }
    
    // Add critical resource hints
    this.addCriticalResourceHints();
    
    // Initialize enhanced lazy loading
    this.initializeEnhancedLazyLoading();
    
    // Initialize base SEO
    this.initializeSEO(config.url);
    
    // Start performance monitoring
    PerformanceMonitoringService.initializeMonitoring();
    
    console.log('✅ Enhanced SEO initialization complete');
  }
}