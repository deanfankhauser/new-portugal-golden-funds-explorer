
import { useEffect } from 'react';
import { PerformanceMonitoringService } from '../services/performanceMonitoringService';
import { ImageOptimizationService } from '../services/imageOptimizationService';
import { AdvancedSEOService } from '../services/advancedSEOService';

export const useAppSEOOptimization = () => {
  useEffect(() => {
    // Initialize performance monitoring on app start
    PerformanceMonitoringService.initializeMonitoring();
    
    // Initialize image optimization
    ImageOptimizationService.initializeGlobalOptimization();

    return () => {
      // Cleanup on unmount
      PerformanceMonitoringService.cleanup();
      ImageOptimizationService.cleanup();
    };
  }, []);

  return {
    initializePageSEO: AdvancedSEOService.initializePageSEO,
    getPerformanceMetrics: PerformanceMonitoringService.getMetrics
  };
};
