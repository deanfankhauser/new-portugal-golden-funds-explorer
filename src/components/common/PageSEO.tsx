
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { ConsolidatedSEOService } from '../../services/consolidatedSEOService';
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
      // Single source of truth: ConsolidatedSEOService
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
      
      // Only noindex true 404 pages
      if (pageType === '404') {
        let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
        if (!robots) {
          robots = document.createElement('meta');
          robots.setAttribute('name', 'robots');
          document.head.appendChild(robots);
        }
        robots.setAttribute('content', 'noindex, follow');
      }
      
    } catch (error) {
      console.error('[PageSEO] Error:', error);
    }
  }, [pageType, fundName, managerName, categoryName, tagName, comparisonTitle, comparisonSlug, funds]);

  return (
    <SEOErrorBoundary>
      {children}
    </SEOErrorBoundary>
  );
};

export default PageSEO;
