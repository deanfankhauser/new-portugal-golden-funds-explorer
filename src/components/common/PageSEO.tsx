
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
  children 
}) => {
  useEffect(() => {
    try {
      const seoData = ConsolidatedSEOService.getSEOData(pageType, {
        fundName,
        managerName,
        categoryName,
        tagName,
        comparisonTitle
      });

      ConsolidatedSEOService.applyMetaTags(seoData);
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
