
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Declare gtag types
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export class AdvancedPerformanceService {
  private static performanceData: Record<string, number> = {};
  
  // Initialize all performance optimizations
  static initializeAdvancedOptimizations(): void {
    this.setupWebVitalsMonitoring();
    this.initializeImageOptimization();
    this.setupServiceWorker();
    this.initializePrefetching();
    this.optimizeFonts();
    this.setupResourceHints();
  }

  // Enhanced Web Vitals monitoring with real user metrics
  private static setupWebVitalsMonitoring(): void {
    const reportMetric = (metric: any) => {
      console.log(`${metric.name}: ${metric.value}`);
      this.performanceData[metric.name] = metric.value;
      
      // Send to analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }
    };

    getCLS(reportMetric);
    getFID(reportMetric);
    getFCP(reportMetric);
    getLCP(reportMetric);
    getTTFB(reportMetric);
  }

  // Advanced image optimization with progressive loading
  private static initializeImageOptimization(): void {
    // Create intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // Progressive loading with low-quality placeholder
            if (img.dataset.src) {
              const highQualityImg = new Image();
              highQualityImg.onload = () => {
                img.src = img.dataset.src!;
                img.classList.remove('loading-placeholder');
                img.classList.add('loaded');
              };
              highQualityImg.src = img.dataset.src;
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before image is visible
        threshold: 0.01
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Setup service worker for caching
  private static setupServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  // Intelligent prefetching based on user behavior
  private static initializePrefetching(): void {
    // Prefetch on hover for likely navigation
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.hostname === window.location.hostname) {
        this.prefetchPage(link.href);
      }
    });

    // Prefetch visible links in viewport
    if ('IntersectionObserver' in window) {
      const linkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            this.prefetchPage(link.href);
          }
        });
      }, { threshold: 0.5 });

      // Observe internal links
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        linkObserver.observe(link);
      });
    }
  }

  // Prefetch page resources
  private static prefetchPage(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  // Optimize font loading
  private static optimizeFonts(): void {
    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = fontUrl;
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
  }

  // Setup resource hints for better performance
  private static setupResourceHints(): void {
    const domains = [
      'https://www.googletagmanager.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.prod.website-files.com'
    ];

    domains.forEach(domain => {
      // DNS prefetch
      const dnsLink = document.createElement('link');
      dnsLink.rel = 'dns-prefetch';
      dnsLink.href = domain;
      document.head.appendChild(dnsLink);

      // Preconnect for critical domains
      if (domain.includes('fonts') || domain.includes('gtm')) {
        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = domain;
        if (domain.includes('gstatic')) {
          preconnectLink.crossOrigin = 'anonymous';
        }
        document.head.appendChild(preconnectLink);
      }
    });
  }

  // Get performance metrics for monitoring
  static getPerformanceMetrics(): Record<string, number> {
    return { ...this.performanceData };
  }

  // Check if performance budget is met
  static checkPerformanceBudget(): boolean {
    const metrics = this.getPerformanceMetrics();
    return (
      (metrics.LCP || 0) < 2500 && // LCP < 2.5s
      (metrics.FID || 0) < 100 && // FID < 100ms
      (metrics.CLS || 0) < 0.1 // CLS < 0.1
    );
  }
}
