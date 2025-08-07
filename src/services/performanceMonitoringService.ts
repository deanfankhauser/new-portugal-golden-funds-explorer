
export interface CoreWebVitalsMetrics {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay  
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
}

export class PerformanceMonitoringService {
  private static metrics: CoreWebVitalsMetrics = {};
  private static observers: PerformanceObserver[] = [];

  // Initialize comprehensive performance monitoring
  static initializeMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      // Performance monitoring not available
      return;
    }

    this.monitorLCP();
    this.monitorFID();
    this.monitorCLS();
    this.monitorFCP();
    this.monitorTTFB();
    this.monitorResourceLoading();
    
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => this.reportMetrics(), 2000);
    });
  }

  // Monitor Largest Contentful Paint
  private static monitorLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.LCP = lastEntry.startTime;
        // LCP measured: lastEntry.startTime
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      // LCP monitoring not supported
    }
  }

  // Monitor First Input Delay
  private static monitorFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.FID = fid;
          // FID measured: fid
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      // FID monitoring not supported
    }
  }

  // Monitor Cumulative Layout Shift
  private static monitorCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.CLS = clsValue;
        // CLS measured: clsValue
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      // CLS monitoring not supported
    }
  }

  // Monitor First Contentful Paint
  private static monitorFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            // FCP measured: entry.startTime
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      // FCP monitoring not supported
    }
  }

  // Monitor Time to First Byte
  private static monitorTTFB(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.responseStart) {
            this.metrics.TTFB = entry.responseStart - entry.requestStart;
            // TTFB measured: this.metrics.TTFB
          }
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      // TTFB monitoring not supported
    }
  }

  // Monitor resource loading performance
  private static monitorResourceLoading(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 1000) { // Resources taking more than 1 second
            console.warn(`Slow resource loading: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      // Resource monitoring not supported
    }
  }

  // Report all collected metrics
  static reportMetrics(): void {
    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Core Web Vitals Report:', this.metrics);
      
      // Evaluate performance
      const evaluation = this.evaluatePerformance();
      console.log('📈 Performance Evaluation:', evaluation);
    }
  }

  // Evaluate performance based on Core Web Vitals thresholds
  private static evaluatePerformance(): {
    LCP: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    FID: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    CLS: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    overall: 'good' | 'needs-improvement' | 'poor';
  } {
    const lcpScore = this.metrics.LCP 
      ? this.metrics.LCP <= 2500 ? 'good' 
        : this.metrics.LCP <= 4000 ? 'needs-improvement' 
        : 'poor'
      : 'unknown';

    const fidScore = this.metrics.FID 
      ? this.metrics.FID <= 100 ? 'good' 
        : this.metrics.FID <= 300 ? 'needs-improvement' 
        : 'poor'
      : 'unknown';

    const clsScore = this.metrics.CLS !== undefined
      ? this.metrics.CLS <= 0.1 ? 'good' 
        : this.metrics.CLS <= 0.25 ? 'needs-improvement' 
        : 'poor'
      : 'unknown';

    const scores = [lcpScore, fidScore, clsScore].filter(score => score !== 'unknown');
    const goodCount = scores.filter(score => score === 'good').length;
    const poorCount = scores.filter(score => score === 'poor').length;

    let overall: 'good' | 'needs-improvement' | 'poor';
    if (goodCount === scores.length) {
      overall = 'good';
    } else if (poorCount > 0) {
      overall = 'poor';
    } else {
      overall = 'needs-improvement';
    }

    return { LCP: lcpScore, FID: fidScore, CLS: clsScore, overall };
  }

  // Get current metrics
  static getMetrics(): CoreWebVitalsMetrics {
    return { ...this.metrics };
  }

  // Clean up observers
  static cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}
