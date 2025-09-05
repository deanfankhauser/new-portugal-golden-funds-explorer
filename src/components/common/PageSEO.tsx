
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
  comparisonSlug,
  funds,
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
        comparisonTitle,
        comparisonSlug,
        funds
      });

      ConsolidatedSEOService.applyMetaTags(seoData);
      
      // Only noindex true 404 pages, never fund pages
      if (pageType === '404') {
        let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
        if (!robots) {
          robots = document.createElement('meta');
          robots.setAttribute('name', 'robots');
          document.head.appendChild(robots);
        }
        robots.setAttribute('content', 'noindex, follow');
      }
      
      // Initialize performance optimizations
      PerformanceOptimizationService.initializePerformanceOptimizations();
      
      // Auto-fix common SEO issues
      EnhancedSEOValidationService.autoFixSEOIssues();
      
    } catch (error) {
      // Silent error handling - no console logging
    }
  }, [pageType, fundName, managerName, categoryName, tagName, comparisonTitle, comparisonSlug, funds]);

  return (
    <SEOErrorBoundary>
      {children}
    </SEOErrorBoundary>
  );
};

export default PageSEO;
