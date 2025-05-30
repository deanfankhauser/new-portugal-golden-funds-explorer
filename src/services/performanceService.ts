
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
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Optimize images with WebP format detection
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
      
      const separator = originalSrc.includes('?') ? '&' : '?';
      optimizedSrc = `${originalSrc}${separator}${params.toString()}`;
    }

    // Convert to WebP if supported and not already WebP
    if (supportsWebP && !originalSrc.includes('.webp')) {
      optimizedSrc = optimizedSrc.replace(/\.(jpg|jpeg|png)/, '.webp');
    }

    return optimizedSrc;
  }

  // Preload critical resources
  static preloadCriticalResources(): void {
    const criticalImages = [
      'https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/66fbc14f0b738f09e77cadb8_fav.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Monitor Core Web Vitals
  static monitorCoreWebVitals(): void {
    // Web Vitals monitoring would typically use a library like web-vitals
    // For now, we'll set up basic performance monitoring
    
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as any; // Type assertion for FID specific properties
          console.log('FID:', fidEntry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const clsEntry = entry as any; // Type assertion for CLS specific properties
          if (!clsEntry.hadRecentInput) {
            console.log('CLS:', clsEntry.value);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Initialize all performance optimizations
  static initializePerformanceOptimizations(): void {
    this.preloadCriticalResources();
    this.initializeLazyLoading();
    this.monitorCoreWebVitals();
  }
}
