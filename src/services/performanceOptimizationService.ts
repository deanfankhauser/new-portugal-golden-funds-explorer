export class PerformanceOptimizationService {
  
  // Initialize all performance optimizations
  static initializePerformanceOptimizations(): void {
    this.addCriticalResourcePreloads();
    this.addPreconnectDirectives();
    this.optimizeImageLoading();
    this.addSecurityHeaders();
  }

  // Add preload directives for critical resources
  private static addCriticalResourcePreloads(): void {
    const criticalResources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { href: '/assets/main.css', as: 'style' }
    ];

    criticalResources.forEach(resource => {
      if (!document.querySelector(`link[rel="preload"][href="${resource.href}"]`)) {
        const preload = document.createElement('link');
        preload.rel = 'preload';
        preload.href = resource.href;
        preload.as = resource.as;
        if (resource.type) preload.type = resource.type;
        if (resource.crossorigin) preload.crossOrigin = resource.crossorigin;
        document.head.appendChild(preload);
      }
    });
  }

  // Add preconnect directives for external domains
  private static addPreconnectDirectives(): void {
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ];

    externalDomains.forEach(domain => {
      if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = domain;
        if (domain.includes('fonts')) {
          preconnect.crossOrigin = 'anonymous';
        }
        document.head.appendChild(preconnect);
      }
    });
  }

  // Optimize image loading across the site
  private static optimizeImageLoading(): void {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach((img: HTMLImageElement) => {
      // Add lazy loading to non-critical images
      if (!img.loading && !img.closest('[data-critical]')) {
        img.loading = 'lazy';
      }

      // Add missing alt text for accessibility
      if (!img.alt) {
        const src = img.src || img.getAttribute('data-src') || '';
        const filename = src.split('/').pop()?.split('.')[0] || 'image';
        img.alt = `${filename.replace(/[-_]/g, ' ')}`;
      }

      // Mark as processed
      img.setAttribute('data-optimized', 'true');
    });
  }

  // Add security and performance headers via meta tags
  private static addSecurityHeaders(): void {
    const headers = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    headers.forEach(header => {
      if (!document.querySelector(`meta[name="${header.name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = header.name;
        meta.content = header.content;
        document.head.appendChild(meta);
      }
    });
  }

  // Validate and report performance metrics
  static validatePerformanceOptimizations(): {
    preloadsCount: number;
    preconnectsCount: number;
    optimizedImagesCount: number;
    lazyImagesCount: number;
    securityHeadersCount: number;
    score: number;
  } {
    const preloads = document.querySelectorAll('link[rel="preload"]').length;
    const preconnects = document.querySelectorAll('link[rel="preconnect"]').length;
    const optimizedImages = document.querySelectorAll('img[data-optimized]').length;
    const lazyImages = document.querySelectorAll('img[loading="lazy"]').length;
    const securityHeaders = document.querySelectorAll('meta[name^="X-"], meta[name="Referrer-Policy"]').length;

    // Calculate performance score
    let score = 100;
    if (preloads === 0) score -= 15;
    if (preconnects < 2) score -= 10;
    if (optimizedImages === 0) score -= 20;
    if (lazyImages === 0) score -= 10;
    if (securityHeaders < 3) score -= 5;

    return {
      preloadsCount: preloads,
      preconnectsCount: preconnects,
      optimizedImagesCount: optimizedImages,
      lazyImagesCount: lazyImages,
      securityHeadersCount: securityHeaders,
      score: Math.max(0, score)
    };
  }

  // Generate performance report
  static generatePerformanceReport(): string {
    const metrics = this.validatePerformanceOptimizations();
    
    let report = `⚡ Performance Optimization Report\n`;
    report += `Score: ${metrics.score}/100\n\n`;
    report += `🔗 Preload Directives: ${metrics.preloadsCount}\n`;
    report += `🌐 Preconnect Directives: ${metrics.preconnectsCount}\n`;
    report += `🖼️ Optimized Images: ${metrics.optimizedImagesCount}\n`;
    report += `💤 Lazy Loaded Images: ${metrics.lazyImagesCount}\n`;
    report += `🛡️ Security Headers: ${metrics.securityHeadersCount}\n`;

    if (metrics.score < 80) {
      report += `\n⚠️ Performance can be improved by:\n`;
      if (metrics.preloadsCount === 0) report += `• Adding preload directives for critical resources\n`;
      if (metrics.preconnectsCount < 2) report += `• Adding preconnect directives for external domains\n`;
      if (metrics.optimizedImagesCount === 0) report += `• Using OptimizedImage component for images\n`;
      if (metrics.lazyImagesCount === 0) report += `• Implementing lazy loading for images\n`;
      if (metrics.securityHeadersCount < 3) report += `• Adding security headers\n`;
    }

    return report;
  }
}