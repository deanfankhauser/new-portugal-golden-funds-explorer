/**
 * Core Web Vitals Monitoring Service
 * Tracks and reports key performance metrics for SEO
 */

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsReport {
  lcp?: WebVitalMetric;
  fid?: WebVitalMetric;
  cls?: WebVitalMetric;
  fcp?: WebVitalMetric;
  ttfb?: WebVitalMetric;
  inp?: WebVitalMetric;
}

export class CoreWebVitalsService {
  private static metrics: WebVitalsReport = {};
  private static observers: PerformanceObserver[] = [];

  /**
   * Initialize Core Web Vitals monitoring
   */
  static initialize(): void {
    try {
      // Only run in browser
      if (typeof window === 'undefined') return;

      // Monitor LCP (Largest Contentful Paint)
      this.observeLCP();

      // Monitor FID (First Input Delay) and INP (Interaction to Next Paint)
      this.observeInteraction();

      // Monitor CLS (Cumulative Layout Shift)
      this.observeCLS();

      // Monitor FCP (First Contentful Paint)
      this.observeFCP();

      // Monitor TTFB (Time to First Byte)
      this.observeTTFB();

      console.log('[CoreWebVitals] Monitoring initialized');
    } catch (error) {
      console.error('[CoreWebVitals] Initialization error:', error);
    }
  }

  /**
   * Observe Largest Contentful Paint
   */
  private static observeLCP(): void {
    try {
      if (!('PerformanceObserver' in window)) return;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry?.renderTime || lastEntry?.loadTime) {
          const value = lastEntry.renderTime || lastEntry.loadTime;
          this.metrics.lcp = {
            name: 'LCP',
            value: Math.round(value),
            rating: this.rateLCP(value),
            timestamp: Date.now()
          };
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[CoreWebVitals] LCP observation error:', error);
    }
  }

  /**
   * Observe First Input Delay and Interaction to Next Paint
   */
  private static observeInteraction(): void {
    try {
      if (!('PerformanceObserver' in window)) return;

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const value = entry.processingStart - entry.startTime;
            this.metrics.fid = {
              name: 'FID',
              value: Math.round(value),
              rating: this.rateFID(value),
              timestamp: Date.now()
            };
          }
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // INP Observer (newer metric replacing FID)
      if ('PerformanceEventTiming' in window) {
        const inpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.interactionId) {
              const value = entry.duration;
              this.metrics.inp = {
                name: 'INP',
                value: Math.round(value),
                rating: this.rateINP(value),
                timestamp: Date.now()
              };
            }
          });
        });

        inpObserver.observe({ entryTypes: ['event'] });
        this.observers.push(inpObserver);
      }
    } catch (error) {
      console.error('[CoreWebVitals] Interaction observation error:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private static observeCLS(): void {
    try {
      if (!('PerformanceObserver' in window)) return;

      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = {
              name: 'CLS',
              value: Math.round(clsValue * 1000) / 1000,
              rating: this.rateCLS(clsValue),
              timestamp: Date.now()
            };
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[CoreWebVitals] CLS observation error:', error);
    }
  }

  /**
   * Observe First Contentful Paint
   */
  private static observeFCP(): void {
    try {
      if (!('PerformanceObserver' in window)) return;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = {
              name: 'FCP',
              value: Math.round(entry.startTime),
              rating: this.rateFCP(entry.startTime),
              timestamp: Date.now()
            };
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[CoreWebVitals] FCP observation error:', error);
    }
  }

  /**
   * Observe Time to First Byte
   */
  private static observeTTFB(): void {
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as any;
      if (navEntry?.responseStart) {
        const value = navEntry.responseStart;
        this.metrics.ttfb = {
          name: 'TTFB',
          value: Math.round(value),
          rating: this.rateTTFB(value),
          timestamp: Date.now()
        };
      }
    } catch (error) {
      console.error('[CoreWebVitals] TTFB observation error:', error);
    }
  }

  /**
   * Rating functions based on Google's thresholds
   */
  private static rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private static rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private static rateINP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 200) return 'good';
    if (value <= 500) return 'needs-improvement';
    return 'poor';
  }

  private static rateCLS(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private static rateFCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  private static rateTTFB(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get current metrics report
   */
  static getMetrics(): WebVitalsReport {
    return { ...this.metrics };
  }

  /**
   * Get metrics score (0-100)
   */
  static getScore(): number {
    const ratings = Object.values(this.metrics).map(m => m.rating);
    if (ratings.length === 0) return 0;

    const goodCount = ratings.filter(r => r === 'good').length;
    const needsImpCount = ratings.filter(r => r === 'needs-improvement').length;
    
    // Good = 100, Needs Improvement = 50, Poor = 0
    const totalScore = (goodCount * 100) + (needsImpCount * 50);
    return Math.round(totalScore / ratings.length);
  }

  /**
   * Generate performance report
   */
  static generateReport(): string {
    const metrics = this.getMetrics();
    const score = this.getScore();

    let report = `\n=== Core Web Vitals Report ===\n`;
    report += `Overall Score: ${score}/100\n\n`;

    Object.entries(metrics).forEach(([key, metric]) => {
      const icon = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
      report += `${icon} ${metric.name}: ${metric.value}ms (${metric.rating})\n`;
    });

    report += `\n=== Recommendations ===\n`;
    if (metrics.lcp && metrics.lcp.rating !== 'good') {
      report += `- Optimize LCP: Reduce image sizes, preload critical resources\n`;
    }
    if (metrics.cls && metrics.cls.rating !== 'good') {
      report += `- Fix CLS: Add dimensions to images, avoid layout shifts\n`;
    }
    if ((metrics.fid && metrics.fid.rating !== 'good') || (metrics.inp && metrics.inp.rating !== 'good')) {
      report += `- Improve interactivity: Reduce JavaScript execution time\n`;
    }

    return report;
  }

  /**
   * Cleanup observers
   */
  static disconnect(): void {
    try {
      this.observers.forEach(observer => observer.disconnect());
      this.observers = [];
      this.metrics = {};
    } catch (error) {
      console.error('[CoreWebVitals] Disconnect error:', error);
    }
  }
}
