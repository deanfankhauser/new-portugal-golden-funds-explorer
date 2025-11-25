
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { ConsolidatedSEOService } from '../../services/consolidatedSEOService';
import { EnhancedSEOValidationService } from '../../services/enhancedSEOValidationService';
import { PerformanceOptimizationService } from '../../services/performanceOptimizationService';
import { SEOErrorBoundary } from './SEOErrorBoundary';

interface PageSEOComponentProps extends PageSEOProps {
  children?: React.ReactNode;
}

/**
 * PageSEO Component
 * 
 * IMPORTANT: This component runs ONLY in the browser after initial page load (client-side).
 * During SSR/SSG build time, meta tags are injected directly into static HTML by:
 * - src/ssg/ssrRenderer.ts (fetches SEO data)
 * - src/ssg/htmlTemplateGenerator.ts (injects meta tags into <head>)
 * 
 * This component updates meta tags during client-side navigation between pages.
 * The useEffect hook does NOT execute during server-side rendering.
 */
export const PageSEO: React.FC<PageSEOComponentProps> = ({ 
  pageType, 
  fundName, 
  managerName, 
  categoryName, 
  tagName,
  comparisonTitle,
  comparisonSlug,
  funds,
  memberName,
  memberRole,
  linkedinUrl,
  children 
}) => {
  // This useEffect only runs in the browser after hydration, NOT during SSR/SSG build
  useEffect(() => {
    try {
      // Apply SEO meta tags
const seoData = ConsolidatedSEOService.getSEOData(
        pageType,
        {
          fundName,
          managerName,
          categoryName,
          tagName,
          comparisonTitle,
          comparisonSlug,
          name: memberName,
          role: memberRole,
          linkedinUrl,
        },
        funds
      );

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
      
      // Defer performance optimizations and SEO fixes to avoid forced reflows
      requestAnimationFrame(() => {
        PerformanceOptimizationService.initializePerformanceOptimizations();
        EnhancedSEOValidationService.autoFixSEOIssues();
      });
      
    } catch (error) {
      console.error('SEO Error:', error);
    }
  }, [pageType, fundName, managerName, categoryName, tagName, comparisonTitle, comparisonSlug, funds, memberName, memberRole, linkedinUrl]);

  return (
    <SEOErrorBoundary>
      {children}
    </SEOErrorBoundary>
  );
};

export default PageSEO;
