
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AdvancedSEOService } from '../services/advancedSEOService';
import { PerformanceMonitoringService } from '../services/performanceMonitoringService';
import { ImageOptimizationService } from '../services/imageOptimizationService';

export const useSEOOptimization = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize performance monitoring on app start
    PerformanceMonitoringService.initializeMonitoring();
    
    // Initialize image optimization
    ImageOptimizationService.initializeLazyLoading();
    
    // Preload critical images
    const criticalImages = [
      'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg'
    ];
    ImageOptimizationService.preloadCriticalImages(criticalImages);

    return () => {
      // Cleanup on unmount
      PerformanceMonitoringService.cleanup();
    };
  }, []);

  useEffect(() => {
    // Scroll to top on route change for better UX
    window.scrollTo(0, 0);
    
    // Add a small delay to ensure page content is loaded
    setTimeout(() => {
      // Report performance metrics after navigation
      PerformanceMonitoringService.reportMetrics();
    }, 1000);
  }, [location.pathname]);

  return {
    initializePageSEO: AdvancedSEOService.initializePageSEO,
    getPerformanceMetrics: PerformanceMonitoringService.getMetrics
  };
};
