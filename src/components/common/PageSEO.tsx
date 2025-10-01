
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { ConsolidatedSEOService } from '../../services/consolidatedSEOService';
import { EnhancedSEOValidationService } from '../../services/enhancedSEOValidationService';
import { PerformanceOptimizationService } from '../../services/performanceOptimizationService';
import { CoreWebVitalsService } from '../../services/coreWebVitalsService';
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

      // Critical: Never apply noindex to fund pages
      // Only apply noindex to 404 pages and auth pages
      const noIndexPages = ['404', 'manager-auth', 'investor-auth'];
      if (noIndexPages.includes(pageType)) {
        const robotsContent = pageType === '404' ? 'noindex, follow' : 'noindex, nofollow';
        let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
        if (!robots) {
          robots = document.createElement('meta');
          robots.setAttribute('name', 'robots');
          document.head.appendChild(robots);
        }
        robots.setAttribute('content', robotsContent);
      } else {
        // Ensure fund pages are indexed
        let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
        if (robots && robots.getAttribute('content')?.includes('noindex')) {
          robots.setAttribute('content', 'index, follow, max-image-preview:large');
        }
      }
      
      // Initialize Core Web Vitals monitoring
      CoreWebVitalsService.initialize();
      
      // Defer performance optimizations and SEO fixes to avoid forced reflows
      requestAnimationFrame(() => {
        PerformanceOptimizationService.initializePerformanceOptimizations();
        EnhancedSEOValidationService.autoFixSEOIssues();
      });
      
    } catch (error) {
      console.error('SEO Error:', error);
    }
  }, [pageType, fundName, managerName, categoryName, tagName, comparisonTitle, comparisonSlug, funds]);

  return (
    <SEOErrorBoundary>
      {children}
    </SEOErrorBoundary>
  );
};

export default PageSEO;
