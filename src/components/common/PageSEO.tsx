
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { SEODataService } from '../../services/seoDataService';
import { MetaTagManager } from '../../services/metaTagManager';

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
      // Generate SEO data
      const seoData = SEODataService.getSEOData({
        pageType,
        fundName,
        managerName,
        categoryName,
        tagName,
        comparisonTitle
      });

      // Apply SEO using consolidated manager
      if (seoData) {
        MetaTagManager.applySEO(seoData);
      }
    } catch (error) {
      console.error('PageSEO: Error initializing SEO:', error);
    }
  }, [pageType, fundName, managerName, categoryName, tagName, comparisonTitle]);

  return <>{children}</>;
};

export default PageSEO;
