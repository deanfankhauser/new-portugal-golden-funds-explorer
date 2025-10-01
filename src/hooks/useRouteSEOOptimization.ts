
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PerformanceMonitoringService } from '../services/performanceMonitoringService';
import { CoreWebVitalsService } from '../services/coreWebVitalsService';
import { FAQSchemaService } from '../services/faqSchemaService';

export const useRouteSEOOptimization = () => {
  const location = useLocation();

  useEffect(() => {
    // Clear FAQ schemas on route change to prevent conflicts
    FAQSchemaService.clearAll();
    
    // Scroll to top on route change for better UX
    window.scrollTo(0, 0);
    
    // Reinitialize Core Web Vitals on route change
    CoreWebVitalsService.initialize();
    
    // Use requestAnimationFrame to avoid forced reflows when reporting metrics
    requestAnimationFrame(() => {
      setTimeout(() => {
        PerformanceMonitoringService.reportMetrics();
      }, 1000);
    });
  }, [location.pathname]);

  return null;
};
