import { useEffect, useState } from 'react';
import { EnhancedSEOValidationService, EnhancedSEOValidationResult } from '../services/enhancedSEOValidationService';
import { PerformanceOptimizationService } from '../services/performanceOptimizationService';

export const useSEOValidation = (enabled: boolean = import.meta.env.DEV) => {
  const [validationResult, setValidationResult] = useState<EnhancedSEOValidationResult | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Delay validation to allow DOM to settle
    const timer = setTimeout(() => {
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
    }, 1000);

    return () => clearTimeout(timer);
  }, [enabled]);

  return {
    validationResult,
    performanceMetrics,
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