
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PerformanceMonitoringService } from '../services/performanceMonitoringService';

export const useRouteSEOOptimization = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change for better UX
    window.scrollTo(0, 0);
    
    // Use requestAnimationFrame to avoid forced reflows when reporting metrics
    requestAnimationFrame(() => {
      setTimeout(() => {
        PerformanceMonitoringService.reportMetrics();
      }, 1000);
    });
  }, [location.pathname]);

  return null;
};
