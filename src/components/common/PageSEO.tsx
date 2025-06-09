
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
      url: seoData.url
    });
    
    // Force a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      console.log('SEO: Meta tags should now be updated');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [props.pageType, seoData.title, seoData.description, seoData.url]);

  return <MetaTags seoData={seoData} />;
};

export default PageSEO;
