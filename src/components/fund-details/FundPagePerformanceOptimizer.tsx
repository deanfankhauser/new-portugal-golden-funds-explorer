import React, { useEffect } from 'react';
import { Fund } from '../../data/types/funds';

interface FundPagePerformanceOptimizerProps {
  fund: Fund;
}

/**
 * Performance optimization component for fund detail pages
 * Implements preloading, prefetching, and resource hints
 */
export const FundPagePerformanceOptimizer: React.FC<FundPagePerformanceOptimizerProps> = ({ fund }) => {
  useEffect(() => {
    if (!fund) return;

    // Preload critical resources
    const optimizations: (() => void)[] = [];

    // 1. Preconnect to external fund website
    if (fund.websiteUrl) {
      try {
        const url = new URL(fund.websiteUrl);
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = url.origin;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
        optimizations.push(() => preconnect.remove());

        // DNS prefetch as fallback
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = url.origin;
        document.head.appendChild(dnsPrefetch);
        optimizations.push(() => dnsPrefetch.remove());
      } catch (e) {
        // Invalid URL, skip
      }
    }

    // 2. Prefetch category page
    if (fund.category) {
      const categoryLink = document.createElement('link');
      categoryLink.rel = 'prefetch';
      categoryLink.href = `/category/${fund.category.toLowerCase().replace(/\s+/g, '-')}`;
      document.head.appendChild(categoryLink);
      optimizations.push(() => categoryLink.remove());
    }

    // 3. Prefetch manager page
    if (fund.managerName) {
      const managerLink = document.createElement('link');
      managerLink.rel = 'prefetch';
      managerLink.href = `/manager/${fund.managerName.toLowerCase().replace(/\s+/g, '-')}`;
      document.head.appendChild(managerLink);
      optimizations.push(() => managerLink.remove());
    }

    // 4. Add resource timing observer for performance monitoring
    if ('PerformanceObserver' in window && import.meta.env.DEV) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource' && entry.duration > 1000) {
              console.warn(`[Performance] Slow resource: ${entry.name} (${entry.duration.toFixed(0)}ms)`);
            }
          }
        });
        observer.observe({ entryTypes: ['resource'] });
        optimizations.push(() => observer.disconnect());
      } catch (e) {
        // Browser doesn't support PerformanceObserver
      }
    }

    // Cleanup function
    return () => {
      optimizations.forEach(cleanup => cleanup());
    };
  }, [fund]);

  return null; // This component doesn't render anything
};

export default FundPagePerformanceOptimizer;
