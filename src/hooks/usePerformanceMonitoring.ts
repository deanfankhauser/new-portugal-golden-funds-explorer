
import { useEffect, useState } from 'react';
import { AdvancedPerformanceService } from '../services/advancedPerformanceService';

interface PerformanceMetrics {
  LCP?: number;
  FID?: number;
  CLS?: number;
  FCP?: number;
  TTFB?: number;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [performanceBudgetMet, setPerformanceBudgetMet] = useState<boolean>(false);

  useEffect(() => {
    // Initialize advanced performance optimizations
    AdvancedPerformanceService.initializeAdvancedOptimizations();

    // Monitor performance metrics
    const checkMetrics = () => {
      const currentMetrics = AdvancedPerformanceService.getPerformanceMetrics();
      setMetrics(currentMetrics);
      setPerformanceBudgetMet(AdvancedPerformanceService.checkPerformanceBudget());
    };

    // Check metrics periodically
    const interval = setInterval(checkMetrics, 5000);

    // Initial check
    setTimeout(checkMetrics, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    performanceBudgetMet,
    refreshMetrics: () => {
      const currentMetrics = AdvancedPerformanceService.getPerformanceMetrics();
      setMetrics(currentMetrics);
      setPerformanceBudgetMet(AdvancedPerformanceService.checkPerformanceBudget());
    }
  };
};
