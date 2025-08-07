export interface CoreWebVitalsMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  inp: number | null; // Interaction to Next Paint
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

export class CoreWebVitalsService {
  private static metrics: CoreWebVitalsMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    inp: null,
    fcp: null,
    ttfb: null
  };

  private static observers: PerformanceObserver[] = [];

  // Initialize Core Web Vitals monitoring
  static initializeMonitoring(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureINP();
    this.measureFCP();
    this.measureTTFB();
    
    // Report metrics on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics();
      }
    });
    
    // Report metrics on beforeunload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });

    console.log('✅ Core Web Vitals monitoring initialized');
  }

  // Measure Largest Contentful Paint
  private static measureLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP measurement failed:', error);
    }
  }

  // Measure First Input Delay
  private static measureFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      
      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID measurement failed:', error);
    }
  }

  // Measure Cumulative Layout Shift
  private static measureCLS(): void {
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
          }
        });
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS measurement failed:', error);
    }
  }

  // Measure Interaction to Next Paint
  private static measureINP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.inp = entry.processingEnd - entry.startTime;
        });
      });
      
      observer.observe({ type: 'event', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('INP measurement failed:', error);
    }
  }

  // Measure First Contentful Paint
  private static measureFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        });
      });
      
      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FCP measurement failed:', error);
    }
  }

  // Measure Time to First Byte
  private static measureTTFB(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            this.metrics.ttfb = entry.responseStart - entry.requestStart;
          }
        });
      });
      
      observer.observe({ type: 'navigation', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('TTFB measurement failed:', error);
    }
  }

  // Get current metrics
  static getMetrics(): CoreWebVitalsMetrics {
    return { ...this.metrics };
  }

  // Report metrics (can be extended to send to analytics)
  private static reportMetrics(): void {
    const metrics = this.getMetrics();
    
    console.group('📊 Core Web Vitals Report');
    console.log('LCP (Largest Contentful Paint):', metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'Not measured');
    console.log('FID (First Input Delay):', metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'Not measured');
    console.log('CLS (Cumulative Layout Shift):', metrics.cls ? metrics.cls.toFixed(4) : 'Not measured');
    console.log('INP (Interaction to Next Paint):', metrics.inp ? `${metrics.inp.toFixed(2)}ms` : 'Not measured');
    console.log('FCP (First Contentful Paint):', metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'Not measured');
    console.log('TTFB (Time to First Byte):', metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'Not measured');
    console.groupEnd();

    // Send to analytics (example implementation)
    this.sendToAnalytics(metrics);
  }

  // Send metrics to analytics (placeholder implementation)
  private static sendToAnalytics(metrics: CoreWebVitalsMetrics): void {
    // Example: Send to Google Analytics 4
    if (typeof (window as any).gtag !== 'undefined') {
      Object.entries(metrics).forEach(([name, value]) => {
        if (value !== null) {
          (window as any).gtag('event', name, {
            value: Math.round(name === 'cls' ? value * 1000 : value),
            metric_id: name,
            custom_map: { metric_name: name }
          });
        }
      });
    }
    
    // Example: Send to custom analytics endpoint
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(metrics)
    // }).catch(console.error);
  }

  // Cleanup observers
  static cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Get performance scores and recommendations
  static getPerformanceReport(): {
    scores: Record<string, { value: number; rating: 'good' | 'needs-improvement' | 'poor' }>;
    recommendations: string[];
  } {
    const metrics = this.getMetrics();
    const scores: Record<string, { value: number; rating: 'good' | 'needs-improvement' | 'poor' }> = {};
    const recommendations: string[] = [];

    // LCP scoring
    if (metrics.lcp !== null) {
      scores.lcp = {
        value: metrics.lcp,
        rating: metrics.lcp <= 2500 ? 'good' : metrics.lcp <= 4000 ? 'needs-improvement' : 'poor'
      };
      if (scores.lcp.rating !== 'good') {
        recommendations.push('Optimize LCP by reducing server response times, using efficient image formats, and removing unused JavaScript.');
      }
    }

    // FID scoring
    if (metrics.fid !== null) {
      scores.fid = {
        value: metrics.fid,
        rating: metrics.fid <= 100 ? 'good' : metrics.fid <= 300 ? 'needs-improvement' : 'poor'
      };
      if (scores.fid.rating !== 'good') {
        recommendations.push('Improve FID by breaking up long-running tasks, optimizing JavaScript execution, and using web workers.');
      }
    }

    // CLS scoring
    if (metrics.cls !== null) {
      scores.cls = {
        value: metrics.cls,
        rating: metrics.cls <= 0.1 ? 'good' : metrics.cls <= 0.25 ? 'needs-improvement' : 'poor'
      };
      if (scores.cls.rating !== 'good') {
        recommendations.push('Reduce CLS by setting explicit dimensions for images and videos, avoiding dynamic content injection above existing content.');
      }
    }

    return { scores, recommendations };
  }
}