
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PerformanceMonitoringService } from '../services/performanceMonitoringService';

export const useRouteSEOOptimization = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change for better UX
    window.scrollTo(0, 0);
    
    // Add a small delay to ensure page content is loaded
    setTimeout(() => {
      // Report performance metrics after navigation
      PerformanceMonitoringService.reportMetrics();
    }, 1000);
  }, [location.pathname]);

  return null;
};
