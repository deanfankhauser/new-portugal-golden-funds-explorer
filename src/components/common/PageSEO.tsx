
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

      // Add preload hints for critical resources on fund pages
      if (pageType === 'fund' && funds && funds.length > 0) {
        const fund = funds[0];

        // Preload fund manager page
        const managerPreload = document.createElement('link');
        managerPreload.rel = 'prefetch';
        managerPreload.href = `/manager/${fund.managerName.toLowerCase().replace(/\s+/g, '-')}`;
        document.head.appendChild(managerPreload);

        // Preconnect to external resources
        if (fund.websiteUrl) {
          const preconnect = document.createElement('link');
          preconnect.rel = 'preconnect';
          try {
            const url = new URL(fund.websiteUrl);
            preconnect.href = url.origin;
            document.head.appendChild(preconnect);
          } catch (e) {
            // Invalid URL, skip
          }
        }
      }

      // Critical: Never apply noindex to fund pages
      // Only apply noindex to 404 pages and auth pages
      const noIndexPages = ['404', 'manager-auth', 'investor-auth'];
      if (noIndexPages.includes(pageType)) {
        const robotsContent = pageType === '404' ? 'noindex, follow' : 'noindex, nofollow';

        let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
        if (!robots) {
          robots = document.createElement('meta') as HTMLMetaElement;
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
      
      // Dispatch SEO update event for validation
      if (import.meta.env.DEV) {
        window.dispatchEvent(new CustomEvent('seo:updated'));
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
