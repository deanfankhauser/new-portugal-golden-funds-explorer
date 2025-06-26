
import { useEffect } from 'react';
import { PerformanceMonitoringService } from '../services/performanceMonitoringService';
import { ImageOptimizationService } from '../services/imageOptimizationService';
import { AdvancedSEOService } from '../services/advancedSEOService';

export const useAppSEOOptimization = () => {
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

  return {
    initializePageSEO: AdvancedSEOService.initializePageSEO,
    getPerformanceMetrics: PerformanceMonitoringService.getMetrics
  };
};
