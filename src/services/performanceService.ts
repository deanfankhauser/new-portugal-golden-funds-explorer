
export class PerformanceService {
  
  // Lazy load images with intersection observer
  static initializeLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px', // Improved: Start loading 50px before visible
        threshold: 0.01
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Optimize images with WebP format detection and responsive sizing
  static optimizeImageSrc(originalSrc: string, width?: number, height?: number): string {
    // Check if browser supports WebP
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('webp') > -1;
    })();

    let optimizedSrc = originalSrc;

    // Add responsive sizing parameters if available
    if (width || height) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('q', '85'); // Improved: Set quality to 85%
      
      const separator = originalSrc.includes('?') ? '&' : '?';
      optimizedSrc = `${originalSrc}${separator}${params.toString()}`;
    }

    // Convert to WebP if supported and not already WebP
    if (supportsWebP && !originalSrc.includes('.webp')) {
      optimizedSrc = optimizedSrc.replace(/\.(jpg|jpeg|png)/, '.webp');
    }

    return optimizedSrc;
  }

  // Enhanced preloading with priority hints
  static preloadCriticalResources(): void {
    const criticalImages = [
      'https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/66fbc14f0b738f09e77cadb8_fav.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.setAttribute('importance', 'high'); // Priority hint
      document.head.appendChild(link);
    });

    // Preload critical CSS
    const criticalCSS = [
      '/src/index.css'
    ];

    criticalCSS.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
  }

  // Enhanced Core Web Vitals monitoring
  static monitorCoreWebVitals(): void {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // Track if LCP is within budget
        if (lastEntry.startTime > 2500) {
          console.warn('LCP exceeds 2.5s budget:', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as any;
          const fid = fidEntry.processingStart - entry.startTime;
          console.log('FID:', fid);
          
          if (fid > 100) {
            console.warn('FID exceeds 100ms budget:', fid);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            console.log('CLS:', clsEntry.value);
            
            if (clsEntry.value > 0.1) {
              console.warn('CLS exceeds 0.1 budget:', clsEntry.value);
            }
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor Time to First Byte (TTFB)
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const navEntry = entry as PerformanceNavigationTiming;
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          console.log('TTFB:', ttfb);
          
          if (ttfb > 600) {
            console.warn('TTFB exceeds 600ms budget:', ttfb);
          }
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
    }
  }

  // Resource hint optimization
  static optimizeResourceHints(): void {
    const domains = [
      'https://www.googletagmanager.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.prod.website-files.com'
    ];

    domains.forEach(domain => {
      // DNS prefetch for all domains
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

  // Initialize all performance optimizations with enhanced features
  static initializePerformanceOptimizations(): void {
    this.preloadCriticalResources();
    this.initializeLazyLoading();
    this.monitorCoreWebVitals();
    this.optimizeResourceHints();
    
    // Initialize advanced optimizations
    import('../services/advancedPerformanceService').then(({ AdvancedPerformanceService }) => {
      AdvancedPerformanceService.initializeAdvancedOptimizations();
    });
  }
}
