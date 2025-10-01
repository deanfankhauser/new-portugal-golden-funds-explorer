import { useEffect, useState } from 'react';
import { EnhancedSEOValidationService, EnhancedSEOValidationResult } from '../services/enhancedSEOValidationService';
import { PerformanceOptimizationService } from '../services/performanceOptimizationService';

export const useSEOValidation = (enabled: boolean = import.meta.env.DEV) => {
  const [validationResult, setValidationResult] = useState<EnhancedSEOValidationResult | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  const runValidation = () => {
    if (!enabled) return;
    
    // Use requestAnimationFrame to avoid forced reflows
    // This ensures DOM queries happen after layout is complete
    requestAnimationFrame(() => {
      try {
        const seoResult = EnhancedSEOValidationService.validatePageSEO();
        const perfResult = PerformanceOptimizationService.validatePerformanceOptimizations();
        
        setValidationResult(seoResult);
        setPerformanceMetrics(perfResult);

        // Log results in development
        if (import.meta.env.DEV) {
          const seoReport = EnhancedSEOValidationService.generateEnhancedSEOReport();
          const perfReport = PerformanceOptimizationService.generatePerformanceReport();
          
          console.group('🔍 SEO & Performance Validation');
          console.log(seoReport);
          console.log(perfReport);
          console.groupEnd();
        }
      } catch (error) {
        // Silent error handling
      }
    });
  };

  useEffect(() => {
    if (!enabled) return;

    // Track route changes
    const handleRouteChange = () => {
      const newRoute = window.location.pathname;
      if (newRoute !== currentRoute) {
        setCurrentRoute(newRoute);
        // Reset validation result on route change
        setValidationResult(null);
        setPerformanceMetrics(null);
      }
    };

    // Listen to popstate for back/forward navigation
    window.addEventListener('popstate', handleRouteChange);

    // Initial validation with staggered fallbacks using requestAnimationFrame
    const timer1 = setTimeout(runValidation, 500);
    const timer2 = setTimeout(runValidation, 1500);
    const timer3 = setTimeout(runValidation, 3000);

    // Debounce validation to avoid rapid successive calls
    let validationTimeout: NodeJS.Timeout | null = null;
    const debouncedValidation = () => {
      if (validationTimeout) clearTimeout(validationTimeout);
      validationTimeout = setTimeout(runValidation, 300);
    };

    // Listen for SEO updates
    const handleSEOUpdate = () => {
      debouncedValidation();
    };
    window.addEventListener('seo:updated', handleSEOUpdate);

    // MutationObserver to detect head changes
    const observer = new MutationObserver((mutations) => {
      const hasRelevantChanges = mutations.some(mutation => 
        mutation.type === 'childList' && 
        Array.from(mutation.addedNodes).some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node as Element).tagName && 
          ['META', 'TITLE', 'LINK', 'SCRIPT'].includes((node as Element).tagName)
        )
      );
      
      if (hasRelevantChanges) {
        debouncedValidation();
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('seo:updated', handleSEOUpdate);
      observer.disconnect();
    };
  }, [enabled, currentRoute]);

  return {
    validationResult,
    performanceMetrics,
    currentRoute,
    runValidation,
    generateReport: () => {
      if (!validationResult) return '';
      return EnhancedSEOValidationService.generateEnhancedSEOReport();
    },
    generatePerformanceReport: () => {
      if (!performanceMetrics) return '';
      return PerformanceOptimizationService.generatePerformanceReport();
    }
  };
};