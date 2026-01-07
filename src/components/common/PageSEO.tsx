
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { ConsolidatedSEOService } from '../../services/consolidatedSEOService';
import { EnhancedSEOValidationService } from '../../services/enhancedSEOValidationService';
import { PerformanceOptimizationService } from '../../services/performanceOptimizationService';
import { SEOErrorBoundary } from './SEOErrorBoundary';
import { useYearUpdate } from '../../hooks/useYearUpdate';
import { shouldNoindexForQueryParams } from '../../utils/queryParamRobotsHandler';

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
  memberSlug,
  children 
}) => {
  // Auto-update year in titles when New Year passes (avoids SSG rebuilds)
  useYearUpdate(pageType);
  
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
          slug: memberSlug,
        },
        funds
      );

      ConsolidatedSEOService.applyMetaTags(seoData);
      
      // Handle noindex for filter/search URLs with query parameters
      if (shouldNoindexForQueryParams()) {
        let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
        if (!robots) {
          robots = document.createElement('meta');
          robots.setAttribute('name', 'robots');
          document.head.appendChild(robots);
        }
        robots.setAttribute('content', 'noindex, follow');
      }
      // Handle noindex for 404/410 pages, zero-fund tag/category/manager pages, user-authenticated pages, and low-value comparisons
      else {
        const isZeroFundPage = (pageType === 'tag' || pageType === 'category' || pageType === 'manager') && 
                                (!funds || funds.length === 0);
        const isUserAuthenticatedPage = pageType === 'saved-funds' || 
                                        pageType === 'account' || 
                                        pageType === 'dashboard';
        
        if (pageType === '404' || pageType === '410' || isZeroFundPage || isUserAuthenticatedPage) {
          let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
          if (!robots) {
            robots = document.createElement('meta');
            robots.setAttribute('name', 'robots');
            document.head.appendChild(robots);
          }
          const robotsContent = pageType === '410' ? 'noindex, nofollow' : 'noindex, follow';
          robots.setAttribute('content', robotsContent);
        } else if (pageType === 'fund-comparison' && seoData.robots?.includes('noindex')) {
          // Handle noindex for low-value fund comparisons
          let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
          if (!robots) {
            robots = document.createElement('meta');
            robots.setAttribute('name', 'robots');
            document.head.appendChild(robots);
          }
          robots.setAttribute('content', seoData.robots);
        } else if (pageType === 'tag' || pageType === 'category' || pageType === 'manager') {
          // Ensure index,follow for pages with funds
          let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
          if (robots) {
            robots.setAttribute('content', 'index, follow');
          }
        }
      }
      
      // Defer performance optimizations and SEO fixes to avoid forced reflows
      requestAnimationFrame(() => {
        PerformanceOptimizationService.initializePerformanceOptimizations();
        EnhancedSEOValidationService.autoFixSEOIssues();
      });
      
    } catch (error) {
      console.error('SEO Error:', error);
    }
  }, [pageType, fundName, managerName, categoryName, tagName, comparisonTitle, comparisonSlug, funds, memberName, memberRole, linkedinUrl, memberSlug]);

  return (
    <SEOErrorBoundary>
      {children}
    </SEOErrorBoundary>
  );
};

export default PageSEO;
