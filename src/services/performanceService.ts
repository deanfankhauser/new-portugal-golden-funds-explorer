
import { ImageOptimizationService } from './imageOptimizationService';
import { AccessibilityService } from './accessibilityService';

export class PerformanceService {
  
  // Initialize all performance optimizations
  static initializePerformanceOptimizations(): void {
    this.preloadCriticalResources();
    this.initializeLazyLoading();
    this.monitorCoreWebVitals();
    this.optimizeRenderingPerformance();
    
    // Initialize image optimization and accessibility
    ImageOptimizationService.initializeLazyLoading();
    AccessibilityService.initializeAccessibility();
  }

  // Preload critical resources
  static preloadCriticalResources(): void {
    const criticalResources = [
      { 
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', 
        as: 'style',
        crossorigin: 'anonymous'
      },
      { 
        href: 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg', 
        as: 'image'
      }
    ];

    criticalResources.forEach(resource => {
      const existingPreload = document.querySelector(`link[href="${resource.href}"]`);
      if (!existingPreload) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.crossorigin) {
          link.crossOrigin = resource.crossorigin;
        }
        if (resource.as === 'style') {
          link.onload = () => {
            link.rel = 'stylesheet';
          };
        }
        document.head.appendChild(link);
      }
    });
  }

  // Enhanced lazy loading with intersection observer
  static initializeLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }
              img.classList.remove('lazy');
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Also observe content sections for progressive loading
      const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.1
      });

      // Observe images and content sections
      document.querySelectorAll('img[data-src], .fund-card, .fund-section').forEach(element => {
        if (element.tagName === 'IMG') {
          imageObserver.observe(element);
        } else {
          contentObserver.observe(element);
        }
      });
    }
  }

  // Optimize rendering performance
  static optimizeRenderingPerformance(): void {
    // Enable passive event listeners for better scroll performance
    const addPassiveListener = (element: Element, event: string, handler: EventListener) => {
      element.addEventListener(event, handler, { passive: true });
    };

    // Debounce scroll events
    let scrollTimeout: number;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = window.setTimeout(() => {
        // Trigger any scroll-based optimizations
        this.checkViewportVisibility();
      }, 100);
    };

    document.addEventListener('scroll', handleScroll, { passive: true });

    // Optimize font loading
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    }
  }

  // Check which elements are in viewport for optimizations
  static checkViewportVisibility(): void {
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Find elements that are about to enter viewport
    const upcomingElements = document.querySelectorAll('.fund-card[data-src]:not(.loaded)');
    upcomingElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      
      // If element is within 200px of viewport, start loading
      if (elementTop - scrollTop <= viewportHeight + 200) {
        element.classList.add('loading');
      }
    });
  }

  // Monitor Core Web Vitals with enhanced reporting
  static monitorCoreWebVitals(): void {
    if ('PerformanceObserver' in window) {
      // Enhanced LCP monitoring
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcpTime = lastEntry.startTime;
        
        console.log('LCP:', lcpTime);
        
        // Log warning if LCP is too slow
        if (lcpTime > 2500) {
          console.warn('LCP is slower than recommended (>2.5s):', lcpTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Enhanced FID monitoring
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fidTime = entry.processingStart - entry.startTime;
          console.log('FID:', fidTime);
          
          if (fidTime > 100) {
            console.warn('FID is slower than recommended (>100ms):', fidTime);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Enhanced CLS monitoring
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            console.log('CLS score:', clsScore);
            
            if (clsScore > 0.1) {
              console.warn('CLS score is higher than recommended (>0.1):', clsScore);
            }
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('Long task detected:', entry.duration + 'ms');
          if (entry.duration > 50) {
            console.warn('Long task blocking main thread:', entry.duration + 'ms');
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  // Resource hints for better loading
  static addResourceHints(): void {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//images.unsplash.com' },
      { rel: 'dns-prefetch', href: '//pbs.twimg.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const existingHint = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existingHint) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) {
          link.crossOrigin = hint.crossorigin;
        }
        document.head.appendChild(link);
      }
    });
  }
}
