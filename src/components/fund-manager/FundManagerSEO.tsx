
import React, { useEffect } from 'react';
import { FundManagerData, useFundManagerStructuredData } from '../../hooks/useFundManagerStructuredData';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
import { MANAGER_META_DATA } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';
import { managerToSlug } from '../../lib/utils';

interface FundManagerSEOProps {
  managerData: FundManagerData;
}

const FundManagerSEO: React.FC<FundManagerSEOProps> = ({ managerData }) => {
  // Add structured data using our hook
  useFundManagerStructuredData(managerData);

  useEffect(() => {
    const applyMetaTags = () => {
      const pageUrl = URL_CONFIG.buildManagerUrl(managerData.name);
      const managerSlug = managerToSlug(managerData.name);
      
      console.log('FundManagerSEO: Setting SEO for manager:', managerData.name);
      console.log('FundManagerSEO: Current URL:', pageUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(pageUrl);

      // Get hardcoded meta data for this manager
      const metaData = MANAGER_META_DATA[managerSlug];
      
      if (!metaData) {
        console.error('FundManagerSEO: No meta data found for manager:', managerSlug);
        return;
      }

      console.log('FundManagerSEO: Using hardcoded meta data:', metaData.title);

      // Clear all existing managed meta tags
      MetaTagManager.clearAllManagedMetaTags();

      // Set up all meta tags using hardcoded data
      MetaTagManager.setupPageMetaTags({
        title: metaData.title,
        description: metaData.description,
        keywords: metaData.keywords,
        canonicalUrl: pageUrl,
        ogTitle: metaData.ogTitle,
        ogDescription: metaData.ogDescription,
        ogUrl: pageUrl,
        twitterTitle: metaData.twitterTitle,
        twitterDescription: metaData.twitterDescription,
        imageUrl: managerData.logo,
        imageAlt: metaData.imageAlt
      });

      console.log('FundManagerSEO: Meta tags applied successfully');

      // Scroll to top on page load
      window.scrollTo(0, 0);
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 200);
  }, [managerData]);

  return null; // This component doesn't render anything
};

export default FundManagerSEO;
