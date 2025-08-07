
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { ConsolidatedSEOService } from '../../services/consolidatedSEOService';
import { EnhancedSEOValidationService } from '../../services/enhancedSEOValidationService';
import { PerformanceOptimizationService } from '../../services/performanceOptimizationService';
import { SEOErrorBoundary } from './SEOErrorBoundary';

interface PageSEOComponentProps extends PageSEOProps {
  children?: React.ReactNode;
}

export const PageSEO: React.FC<PageSEOComponentProps> = ({ 
  pageType, 
  fundName, 
  managerName, 
  categoryName, 
  tagName,
  comparisonTitle,
  children 
}) => {
  useEffect(() => {
    try {
      // Apply SEO meta tags
      const seoData = ConsolidatedSEOService.getSEOData(pageType, {
        fundName,
        managerName,
        categoryName,
        tagName,
        comparisonTitle
      });

      ConsolidatedSEOService.applyMetaTags(seoData);
      
      // Initialize performance optimizations
      PerformanceOptimizationService.initializePerformanceOptimizations();
      
      // Auto-fix common SEO issues
      EnhancedSEOValidationService.autoFixSEOIssues();
      
    } catch (error) {
      // Silent error handling - no console logging
    }
  }, [pageType, fundName, managerName, categoryName, tagName, comparisonTitle]);

  return (
    <SEOErrorBoundary>
      {children}
    </SEOErrorBoundary>
  );
};

export default PageSEO;
