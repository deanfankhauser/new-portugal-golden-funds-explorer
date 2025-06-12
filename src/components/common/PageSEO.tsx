
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { SEODataService } from '../../services/seoDataService';
import MetaTags from './MetaTags';

const PageSEO: React.FC<PageSEOProps> = (props) => {
  const seoData = SEODataService.getSEOData(props);

  // Debug logging to track meta tag updates
  useEffect(() => {
    console.log(`SEO: Setting meta tags for ${props.pageType}`, {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      pageType: props.pageType,
      fundName: props.fundName
    });
    
    // Force a small delay to ensure DOM is ready and verify title update
    const timer = setTimeout(() => {
      const actualTitle = document.title;
      console.log('SEO: Current document title:', actualTitle);
      console.log('SEO: Expected title:', seoData.title);
      
      if (actualTitle !== seoData.title) {
        console.warn('SEO: Title mismatch detected!');
        // Force update the title if there's a mismatch
        document.title = seoData.title;
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [props.pageType, props.fundName, seoData.title, seoData.description, seoData.url]);

  return <MetaTags seoData={seoData} />;
};

export default PageSEO;
